import { Static, Type } from '@sinclair/typebox'
import archiver, { Archiver } from 'archiver';
import CoT from './cot.js';
import xmljs from 'xml-js';

export const Parameter = Type.Object({
    _attributes: Type.Object({
        name: Type.String(),
        value: Type.String()
    })
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
            Content: Type.Array(Type.Object({
                _attributes: Type.Object({
                    ignore: Type.String(),
                    zipEntry: Type.String()
                }),
                Parameter: Type.Array(Parameter)
            }))
        })
    })
});

export class DataPackage {
    writable: boolean;
    manifest: Static<typeof Manifest>;
    archive: Archiver;
    settings: {
        uid?: string;
        name?: string;
        onReceiveImport?: boolean;
        onReceiveDelete?: boolean;

        [k: string]: boolean | string | undefined;
    }

    constructor() {
        this.writable = true;
        this.archive = archiver('zip', { zlib: { level: 9 } });
        this.settings = {};
        this.manifest = {
            MissionPackageManifest: {
                _attributes: { version: '2' },
                Configuration: {
                    Parameter: []
                },
                Contents: {
                    Content: []
                }
            }
        };
    }

    addCoT(cot: CoT, opts: {
        ignore: boolean
    } = {
        ignore: false
    }) {
        console.error(cot.to_xml())

        const zipEntry = `${cot.raw.event._attributes.uid}/${cot.raw.event._attributes.uid}.cot`;
        this.archive.append(cot.to_xml(), {
            name: zipEntry
        });

        let name = 'Unknown';
        if (cot.raw.event.detail && cot.raw.event.detail.contact) {
            name = cot.raw.event.detail.contact._attributes.callsign;
        }

        this.manifest.MissionPackageManifest.Contents.Content.push({
            _attributes: { ignore: String(opts.ignore), zipEntry },
            Parameter: [{
                _attributes: { name: 'uid', value: cot.raw.event._attributes.uid },
            },{
                _attributes: { name: 'name', value: name }
            }]
        });
    }

    finalize(uid: string, name: string) {
        this.writable = false;

        this.settings.uid = uid;
        this.settings.name = name;

        for (const key in this.settings) {
            if (!this.settings[key]) continue;
            this.manifest.MissionPackageManifest.Configuration.Parameter.push({
                _attributes: { name: key, value: String(this.settings[key]) }
            })
        }

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n${xmljs.js2xml(this.manifest, { compact: true })}`;
        this.archive.append(xml, {
            name: 'MANIFEST/manifest.xml'
        });

        this.archive.finalize()
    }
}
