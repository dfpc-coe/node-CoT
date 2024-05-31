import CoT, { DataPackage } from '../index.js'
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
