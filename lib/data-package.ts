import { createHash } from 'node:crypto';
import { pipeline } from 'stream/promises';
import { rimraf } from 'rimraf'
import { Static, Type } from '@sinclair/typebox'
import Err from '@openaddresses/batch-error';
import archiver from 'archiver';
import StreamZip from 'node-stream-zip'
import { Readable } from 'node:stream';
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
     * When DataPackages are uploaded to TAK Server they generally use an EUD
     * calculated Hash
     */
    static async hash(path: string): Promise<string> {
        const input = fs.createReadStream(path);
        const hash = createHash('sha256');
        await pipeline(input, hash);
        return hash.digest('hex');
    }

    /**
     * When DataPackages are uploaded to TAK Server they generally use an EUD
     * calculated Hash
     */
    async hash(entry: string): Promise<string> {
        return await DataPackage.hash(this.path + '/raw/' + entry);
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

        // TODO: Seen in the wild but not currently implemented here:
        // <Parameter name="contentType" value="KML"/>
        // <Parameter name="visible" value="false"/>

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
     *
     * CoTs have their `attachment_list` field populated if parseAttachments is set to true.
     *   While this field is populated automatically by some ATAK actions such as QuickPic
         other attachment actions do not automatically populate this field other than the link
         provided between a CoT and it's attachment in the MANIFEST file
     */
    async cots(opts = {
        respectIgnore: true,
        parseAttachments: true
    }): Promise<Array<CoT>> {
        if (this.destroyed) throw new Err(400, null, 'Attempt to access Data Package after it has been destroyed');

        const cotsMap: Map<string, CoT> = new Map();

        const cots: CoT[] = [];
        for (const content of this.contents) {
            if (path.parse(content._attributes.zipEntry).ext !== '.cot') continue;
            if (opts.respectIgnore && content._attributes.ignore) continue;

            const cot = new CoT(await fsp.readFile(this.path + '/raw/' + content._attributes.zipEntry));

            cotsMap.set(cot.uid(), cot);

            cots.push(cot);
        }

        if (opts.parseAttachments) {
            const attachments = this.#attachments(cotsMap, {
                respectIgnore: opts.respectIgnore
            });

            for (const cot of cots) {
                const attaches = attachments.get(cot.uid());
                if (!attaches) continue;

                for (const attach of attaches) {
                    if (!cot.raw.event.detail.attachment_list) {
                        cot.raw.event.detail.attachment_list = {
                            _attributes: {
                                hashes: []
                            }
                        };
                    } else {
                        cot.raw.event.detail.attachment_list._attributes.hashes = JSON.parse(
                            cot.raw.event.detail.attachment_list._attributes.hashes
                        );
                    }

                    // Until told otherwise the FileHash appears to always be the directory name
                    const hash = await this.hash(attach._attributes.zipEntry);

                    if (!cot.raw.event.detail.attachment_list._attributes.hashes.includes(hash)) {
                        cot.raw.event.detail.attachment_list._attributes.hashes.push(hash)
                    }

                    cot.raw.event.detail.attachment_list._attributes.hashes = JSON.stringify(
                        cot.raw.event.detail.attachment_list._attributes.hashes
                    );
                }
            }
        }

        return cots;
    }

    #attachments(cots: Map<string, CoT>, opts = { respectIgnore: true }): Map<string, Array<Static<typeof ManifestContent>>> {
        const attachments: Map<string, Array<Static<typeof ManifestContent>>> = new Map();

        for (const content of this.contents) {
            if (path.parse(content._attributes.zipEntry).ext === '.cot') continue;
            if (opts.respectIgnore && content._attributes.ignore) continue;

            const params = Array.isArray(content.Parameter) ? content.Parameter : [content.Parameter];

            for (const param of params) {
                if (param._attributes.name === 'uid' && cots.has(param._attributes.value)) {
                    const existing = attachments.get(param._attributes.value);
                    if (existing) {
                        existing.push(content);
                    } else {
                        attachments.set(param._attributes.value, [content]);
                    }
                    break;
                }
            }
        }

        return attachments;
    }

    /**
     * Return attachments that are associated in the Manifest with a given CoT
     * Note: this does not return files that are not associated with a CoT
     */
    async attachments(opts = { respectIgnore: true }): Promise<Map<string, Array<Static<typeof ManifestContent>>>> {
        const cots: Map<string, CoT> = new Map();
        for (const cot of await this.cots({
            respectIgnore: opts.respectIgnore,
            parseAttachments: false
        })) {
            cots.set(cot.uid(), cot);
        }

        return this.#attachments(cots, opts);
    }

    /**
     * Get any file from a Package
     */
    async getFile(path: string): Promise<Readable> {
        if (this.destroyed) throw new Err(400, null, 'Attempt to access Data Package after it has been destroyed');

        try {
            await fsp.access(`${this.path}/raw/${path}`)
        } catch (err) {
            throw new Err(400, err instanceof Error ? err : new Error(String(err)), 'Could not access file in Data Package');
        }

        return fs.createReadStream(`${this.path}/raw/${path}`)
    }

    /**
     * Add any file to a Package
     *
     * @param file - Input ReadableStream of File at attach
     * @param opts - Options
     * @param opts.uid - Optional UID for the File, a UUID will be generated if not supplied
     * @param opts.name - Filename for the file
     * @param opts.ignore - Should the file be ignore, defaults to false
     * @param opts.attachment - Should the file be associated as an attachment to a CoT. If so this should contain the UID of the CoT
     */
    async addFile(file: Readable, opts: {
        uid?: string;
        name: string;
        ignore?: boolean;
        attachment?: string;
    }): Promise<void> {
        if (this.destroyed) throw new Err(400, null, 'Attempt to access Data Package after it has been destroyed');
        if (!opts.ignore) opts.ignore = false;

        const uid = opts.uid ?? randomUUID();

        this.#addContent(`${uid}/${opts.name}`, opts.attachment || uid, opts.name, opts.ignore);
        await fsp.mkdir(`${this.path}/raw/${uid}/`, { recursive: true });
        await fsp.writeFile(`${this.path}/raw/${uid}/${opts.name}`, file)
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
