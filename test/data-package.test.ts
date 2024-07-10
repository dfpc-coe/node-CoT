import CoT, { DataPackage } from '../index.js'
import stream2buffer from './stream.js';
import fs from 'node:fs';
import test from 'tape';

test(`DataPackage CoT Parsing: CameraCOTs.zip`, async (t) => {
    const pkg = await DataPackage.parse(new URL('./packages/CameraCOTs.zip', import.meta.url).pathname);

    t.equals(pkg.version, '2');
    t.ok(pkg.path);
    t.deepEquals(pkg.settings, {
        uid: 'fd4310f2-e34a-455d-b1c2-15c06b740a04',
        name: '2024 streaming cameras - not for iTAK'
    });

    t.deepEquals(pkg.contents, [
        {
            _attributes: { ignore: false, zipEntry: '3ecf1e30-f374-4ae6-a051-2da7084ff57d/3ecf1e30-f374-4ae6-a051-2da7084ff57d.cot' },
            Parameter: { _attributes: { name: 'uid', value: '3ecf1e30-f374-4ae6-a051-2da7084ff57d' } }
        }
    ]);

    const cots = await pkg.cots();

    t.equal(cots.length, 1);

    await pkg.destroy();

    t.end();
});

test(`DataPackage CoT Writing`, async (t) => {
    const pkg = new DataPackage();

    pkg.addCoT(CoT.from_geojson({
        id: '123',
        type: 'Feature',
        properties: {
            type: 'a-h-B'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    }));

    pkg.settings.uid = 'top-123';
    pkg.settings.name = 'Custom 123';

    const path = await pkg.finalize();

    const pkg_parse = await DataPackage.parse(path);

    t.equals(pkg_parse.version, '2');
    t.ok(pkg_parse.path);
    t.deepEquals(pkg_parse.settings, {
        uid: 'top-123',
        name: 'Custom 123'
    });

    t.deepEquals(pkg_parse.contents, [
        {
            _attributes: { ignore: false, zipEntry: '123/123.cot' },
            Parameter: [
                { _attributes: { name: 'uid', value: '123' } },
                { _attributes: { name: 'name', value: 'UNKNOWN' } }
            ]
        }
    ]);

    const cots = await pkg_parse.cots();

    t.equal(cots.length, 1);

    await pkg.destroy();
    await pkg_parse.destroy();

    t.end();
});

test(`DataPackage CoT Writing`, async (t) => {
    const pkg = new DataPackage();

    pkg.addCoT(CoT.from_geojson({
        id: '123',
        type: 'Feature',
        properties: {
            type: 'a-h-B'
        },
        geometry: { type: 'Point', coordinates: [0,0] }
    }));

    pkg.settings.uid = 'top-123';
    pkg.settings.name = 'Custom 123';

    const path = await pkg.finalize();

    const pkg_parse = await DataPackage.parse(path);

    t.equals(pkg_parse.version, '2');
    t.ok(pkg_parse.path);
    t.deepEquals(pkg_parse.settings, {
        uid: 'top-123',
        name: 'Custom 123'
    });

    t.deepEquals(pkg_parse.contents, [
        {
            _attributes: { ignore: false, zipEntry: '123/123.cot' },
            Parameter: [
                { _attributes: { name: 'uid', value: '123' } },
                { _attributes: { name: 'name', value: 'UNKNOWN' } }
            ]
        }
    ]);

    const cots = await pkg_parse.cots();

    t.equal(cots.length, 1);

    await pkg.destroy();
    await pkg_parse.destroy();

    t.end();
});

test(`DataPackage CoT Parsing: QuickPic.zip`, async (t) => {
    const pkg = await DataPackage.parse(new URL('./packages/QuickPic.zip', import.meta.url).pathname);

    t.equals(pkg.version, '2');
    t.ok(pkg.path);
    t.deepEquals(pkg.settings, {
        uid: '3b758d3c-5b7a-4fba-a0dc-bbde18e895b5',
        name: '20240702_144514.jpg',
        onReceiveImport: 'true',
        onReceiveDelete: 'true',
        callsign: 'DFPC Ingalls.2.144535'
    });

    t.deepEquals(pkg.contents, [
        {
            _attributes: { ignore: false, zipEntry: '3b758d3c-5b7a-4fba-a0dc-bbde18e895b5/3b758d3c-5b7a-4fba-a0dc-bbde18e895b5.cot' },
            Parameter: { _attributes: { name: 'uid', value: '3b758d3c-5b7a-4fba-a0dc-bbde18e895b5' } }
        }, {
            _attributes: { ignore: false, zipEntry: 'e63e920689815c961ec9d873c83f08a6/20240702_144514.jpg' },
            Parameter: { _attributes: { name: 'uid', value: '3b758d3c-5b7a-4fba-a0dc-bbde18e895b5' } } 
        }
    ]);

    const cots = await pkg.cots();

    t.equal(cots.length, 1);

    const attachments = await pkg.attachments();

    t.equals(attachments.size, 1)

    t.deepEquals(attachments.get('3b758d3c-5b7a-4fba-a0dc-bbde18e895b5'), {
        _attributes: { ignore: false, zipEntry: 'e63e920689815c961ec9d873c83f08a6/20240702_144514.jpg' },
        Parameter: { _attributes: { name: 'uid', value: '3b758d3c-5b7a-4fba-a0dc-bbde18e895b5' } }
    });

    await pkg.destroy();

    t.end();
});

test(`DataPackage CoT Parsing: QuickPic.zip`, async (t) => {
    const pkg = await DataPackage.parse(new URL('./packages/QuickPic.zip', import.meta.url).pathname);

    t.equals(pkg.version, '2');
    t.ok(pkg.path);
    t.deepEquals(pkg.settings, {
        uid: '3b758d3c-5b7a-4fba-a0dc-bbde18e895b5',
        name: '20240702_144514.jpg',
        onReceiveImport: 'true',
        onReceiveDelete: 'true',
        callsign: 'DFPC Ingalls.2.144535'
    });

    t.deepEquals(pkg.contents, [
        {
            _attributes: { ignore: false, zipEntry: '3b758d3c-5b7a-4fba-a0dc-bbde18e895b5/3b758d3c-5b7a-4fba-a0dc-bbde18e895b5.cot' },
            Parameter: { _attributes: { name: 'uid', value: '3b758d3c-5b7a-4fba-a0dc-bbde18e895b5' } }
        }, {
            _attributes: { ignore: false, zipEntry: 'e63e920689815c961ec9d873c83f08a6/20240702_144514.jpg' },
            Parameter: { _attributes: { name: 'uid', value: '3b758d3c-5b7a-4fba-a0dc-bbde18e895b5' } } 
        }
    ]);

    const cots = await pkg.cots();

    t.equal(cots.length, 1);

    const attachments = await pkg.attachments();

    t.equals(attachments.size, 1)

    t.deepEquals(attachments.get('3b758d3c-5b7a-4fba-a0dc-bbde18e895b5'), {
        _attributes: { ignore: false, zipEntry: 'e63e920689815c961ec9d873c83f08a6/20240702_144514.jpg' },
        Parameter: { _attributes: { name: 'uid', value: '3b758d3c-5b7a-4fba-a0dc-bbde18e895b5' } }
    });

    await pkg.destroy();

    t.end();
});

test(`DataPackage CoT Parsing: addFile,getFile`, async (t) => {
    const pkg = new DataPackage();

    t.equals(pkg.version, '2');
    t.ok(pkg.path);

    await pkg.addFile(fs.createReadStream(new URL('../package.json', import.meta.url).pathname), {
        uid: '123',
        name: 'package.json'
    })

    t.deepEquals(pkg.contents, [
        {
            _attributes: { ignore: false, zipEntry: '123/package.json' },
            Parameter: [
                { _attributes: { name: 'uid', value: '123' } },
                { _attributes: { name: 'name', value: 'package.json' } }
            ]
        }
    ]);

    const buff = await stream2buffer(await pkg.getFile('123/package.json'));

    t.equals(JSON.parse(buff.toString()).name, '@tak-ps/node-cot'); 

    const cots = await pkg.cots();

    t.equal(cots.length, 0);

    const attachments = await pkg.attachments();

    t.equals(attachments.size, 0)

    await pkg.destroy();

    t.end();
});
