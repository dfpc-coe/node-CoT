import { rimraf } from 'rimraf'
import { Static, Type } from '@sinclair/typebox'
import Err from '@openaddresses/batch-error';
import archiver from 'archiver';
import StreamZip from 'node-stream-zip'
import { randomUUID } from 'node:crypto';
import CoT from './cot.js';
import xmljs from 'xml-js';
import os from 'node:os';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import AJV from 'ajv';

export const Parameter = Type.Object({
    _attributes: Type.Object({
        name: Type.String(),
        value: Type.String()
    })
})

export const ManifestContent = Type.Object({
    _attributes: Type.Object({
        ignore: Type.Boolean(),
        zipEntry: Type.String()
    }),
    Parameter: Type.Union([Parameter, Type.Array(Parameter)])
})

export const Manifest = Type.Object({
    MissionPackageManifest: Type.Object({
        _attributes: Type.Object({
            version: Type.String()
        }),
        Configuration: Type.Object({
            Parameter: Type.Array(Parameter)
        }),
        Contents: Type.Object({
            Content: Type.Union([ManifestContent, Type.Array(ManifestContent)])
        })
    })
});

const checkManifest = (new AJV({
    allErrors: true,
    coerceTypes: true,
    allowUnionTypes: true
}))
    .compile(Manifest);

/**
 * Helper class for creating and parsing static Data Packages
 */
export class DataPackage {
    path: string;
    destroyed: boolean;
    version: string;
    contents: Array<Static<typeof ManifestContent>>;
    settings: {
        uid: string;
        name: string;
        onReceiveImport?: boolean;
        onReceiveDelete?: boolean;

        [k: string]: boolean | string | undefined;
    }

    constructor(uid?: string, name?: string) {
        this.path = os.tmpdir() + '/' + randomUUID();
        this.destroyed = false;
        fs.mkdirSync(this.path);
        this.version = '2';
        this.settings = {
            uid: uid ?? randomUUID(),
            name: name ?? 'New Data Package'
        };
        this.contents = [];
    }

    /**
     * The Package should be imported and then removed
     */
    setEphemeral() {
        this.settings.onReceiveImport = true;
        this.settings.onReceiveDelete = true;
    }

    /**
     * The Package should be imported and the package retained
     */
    setPermanent() {
        this.settings.onReceiveImport = true;
        this.settings.onReceiveDelete = false;
    }

    /**
     * Return a string version of the Manifest document
     */
    manifest(): string {
        const manifest: Static<typeof Manifest> = {
            MissionPackageManifest: {
                _attributes: { version: this.version },
                Configuration: {
                    Parameter: []
                },
                Contents: {
                    Content: this.contents
                }
            }
        };

        for (const key in this.settings) {
            if (!this.settings[key]) continue;
            manifest.MissionPackageManifest.Configuration.Parameter.push({
                _attributes: { name: key, value: String(this.settings[key]) }
            })
        }

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n${xmljs.js2xml(manifest, { compact: true })}`;

        return xml;
    }

    /**
     * Return a DataPackage version of an unparsed Data Package Zip
     */
    static async parse(input: string): Promise<DataPackage> {
        const pkg = new DataPackage();

        const zip = new StreamZip.async({
            file: input,
            skipEntryNameValidation: true
        });

        const preentries = await zip.entries();

        if (!preentries['MANIFEST/manifest.xml']) throw new Err(400, null, 'No MANIFEST/manifest.xml found in Data Package');

        await fsp.mkdir(pkg.path + '/raw', { recursive: true });
        await zip.extract(null, pkg.path + '/raw/');

        const xml = xmljs.xml2js(String(await fsp.readFile(pkg.path + '/raw/MANIFEST/manifest.xml')), { compact: true })

        checkManifest(xml);
        if (checkManifest.errors) throw new Err(400, null, `${checkManifest.errors[0].message} (${checkManifest.errors[0].instancePath})`);
        const manifest = xml as Static<typeof Manifest>;

        pkg.version = manifest.MissionPackageManifest._attributes.version;

        if (Array.isArray(manifest.MissionPackageManifest.Contents.Content)) {
            pkg.contents = manifest.MissionPackageManifest.Contents.Content;
        } else {
            pkg.contents = [ manifest.MissionPackageManifest.Contents.Content ];
        }

        for (const param of manifest.MissionPackageManifest.Configuration.Parameter) {
            pkg.settings[param._attributes.name] = param._attributes.value;
        }

        return pkg;
    }

    #addContent(zipEntry: string, uid: string, name: string, ignore = false): void {
        if (this.destroyed) throw new Err(400, null, 'Attempt to access Data Package after it has been destroyed');
        this.contents.push({
            _attributes: { ignore: ignore, zipEntry },
            Parameter: [{
                _attributes: { name: 'uid', value: uid },
            },{
                _attributes: { name: 'name', value: name }
            }]
        });
    }

    /**
     * Return CoT objects for all CoT type features in the Data Package
     */
    async cots(opts = { respectIgnore: true }): Promise<Array<CoT>> {
        if (this.destroyed) throw new Err(400, null, 'Attempt to access Data Package after it has been destroyed');

        const cots: CoT[] = [];
        for (const content of this.contents) {
            if (path.parse(content._attributes.zipEntry).ext !== '.cot') continue;
            if (opts.respectIgnore && content._attributes.ignore) continue;

            cots.push(new CoT(await fsp.readFile(this.path + '/raw/' + content._attributes.zipEntry)));
        }

        return cots;
    }

    /**
     * Return attachments that are associated in the Manifest with a given CoT
     * Note: this does not return files that are not associated with a CoT
     */
    async attachments(opts = { respectIgnore: true }): Promise<Map<string, Static<typeof ManifestContent>>> {
        const cots: Map<string, CoT> = new Map();
        for (const cot of await this.cots(opts)) {
            cots.set(cot.uid(), cot);
        }

        const attachments: Map<string, Static<typeof ManifestContent>> = new Map();

        for (const content of this.contents) {
            if (path.parse(content._attributes.zipEntry).ext === '.cot') continue;
            if (opts.respectIgnore && content._attributes.ignore) continue;

            const params = Array.isArray(content.Parameter) ? content.Parameter : [content.Parameter];

            for (const param of params) {
                if (param._attributes.name === 'uid' && cots.has(param._attributes.value)) {
                    attachments.set(param._attributes.value, content);
                    break;
                }
            }
        }

        return attachments;
    }

    /**
     * Add a CoT marker to the Package
     */
    async addCoT(cot: CoT, opts: {
        ignore: boolean
    } = {
        ignore: false
    }): Promise<void> {
        if (this.destroyed) throw new Err(400, null, 'Attempt to access Data Package after it has been destroyed');

        let name = 'Unknown';
        if (cot.raw.event.detail && cot.raw.event.detail.contact) {
            name = cot.raw.event.detail.contact._attributes.callsign;
        }

        this.#addContent(`${cot.raw.event._attributes.uid}/${cot.raw.event._attributes.uid}.cot`, cot.raw.event._attributes.uid, name, opts.ignore);
        await fsp.mkdir(`${this.path}/raw/${cot.raw.event._attributes.uid}/`, { recursive: true });
        await fsp.writeFile(`${this.path}/raw/${cot.raw.event._attributes.uid}/${cot.raw.event._attributes.uid}.cot`, cot.to_xml())
    }

    /**
     * Destory the underlying FS resources and prevent further mutation
     */
    async destroy(): Promise<void> {
        await rimraf(this.path);
        this.destroyed = true;
    }

    /**
     * Compile the DataPackage into a TAK compatible ZIP File
     * Note this function can be called multiple times and does not
     * affect the ability of the class to continue building a Package
     */
    async finalize(): Promise<string> {
        if (this.destroyed) throw new Err(400, null, 'Attempt to access Data Package after it has been destroyed');

        await fsp.mkdir(this.path + '/raw/MANIFEST', { recursive: true });
        await fsp.writeFile(this.path + '/raw/MANIFEST/manifest.xml', this.manifest());

        return new Promise((resolve) => {
            const archive = archiver('zip', { zlib: { level: 9 } });
            const output = fs.createWriteStream(this.path + `/${this.settings.uid}.zip`)
            archive.pipe(output);
            output.on('close', () => {
                return resolve(this.path + `/${this.settings.uid}.zip`);
            });
            archive.directory(this.path + '/raw/', '/');
            archive.finalize()
        });
    }
}
