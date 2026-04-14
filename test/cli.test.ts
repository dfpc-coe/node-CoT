import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { spawn } from 'node:child_process'
import assert from 'node:assert/strict';
import test from 'node:test';
import { CoTParser, DataPackage } from '../index.js'

interface CLIResult {
    code: number;
    stdout: string;
    stderr: string;
}

async function runCLI(args: string[]): Promise<CLIResult> {
    return await new Promise((resolve, reject) => {
        const child = spawn(process.execPath, [
            '--import', 'tsx',
            new URL('../cli.ts', import.meta.url).pathname,
            ...args
        ], {
            cwd: new URL('..', import.meta.url).pathname
        });

        let stdout = '';
        let stderr = '';

        child.stdout.on('data', (chunk) => {
            stdout += chunk.toString();
        });

        child.stderr.on('data', (chunk) => {
            stderr += chunk.toString();
        });

        child.on('error', reject);
        child.on('close', (code) => {
            resolve({
                code: code ?? 1,
                stdout,
                stderr
            });
        });
    });
}

test('cli feature convert geojson to cot xml', async () => {
    const tmpdir = await fs.mkdtemp(path.join(os.tmpdir(), 'node-cot-cli-'));

    try {
        const geojsonPath = path.join(tmpdir, 'feature.geojson');
        await fs.writeFile(geojsonPath, JSON.stringify({
            type: 'Feature',
            id: 'cli-feature-1',
            properties: {
                type: 'a-f-G-U-C',
                callsign: 'CLI Feature'
            },
            geometry: {
                type: 'Point',
                coordinates: [-77.0365, 38.8977]
            }
        }));

        const result = await runCLI(['feature', 'convert', geojsonPath]);

        assert.equal(result.code, 0);
        assert.equal(result.stderr, '');

        const cot = CoTParser.from_xml(result.stdout);
        assert.equal(cot.uid(), 'cli-feature-1');
        assert.equal(cot.raw.event._attributes.type, 'a-f-G-U-C');
    } finally {
        await fs.rm(tmpdir, { recursive: true, force: true });
    }
});

test('cli feature convert cot xml to geojson', async () => {
    const tmpdir = await fs.mkdtemp(path.join(os.tmpdir(), 'node-cot-cli-'));

    try {
        const cotPath = path.join(tmpdir, 'feature.cot');
        const cot = await CoTParser.from_geojson({
            type: 'Feature',
            id: 'cli-feature-2',
            properties: {
                type: 'a-f-G-U-C',
                callsign: 'CLI Feature 2'
            },
            geometry: {
                type: 'Point',
                coordinates: [-122.4194, 37.7749]
            }
        });

        await fs.writeFile(cotPath, CoTParser.to_xml(cot));

        const result = await runCLI(['feature', 'convert', cotPath]);

        assert.equal(result.code, 0);
        assert.equal(result.stderr, '');

        const feature = JSON.parse(result.stdout);
        assert.equal(feature.type, 'Feature');
        assert.equal(feature.id, 'cli-feature-2');
        assert.equal(feature.properties.callsign, 'CLI Feature 2');
    } finally {
        await fs.rm(tmpdir, { recursive: true, force: true });
    }
});

test('cli package validate valid package', async () => {
    const result = await runCLI([
        'package',
        'validate',
        new URL('./packages/QuickPic.zip', import.meta.url).pathname
    ]);

    assert.equal(result.code, 0);
    assert.equal(result.stderr, '');

    const output = JSON.parse(result.stdout);
    assert.equal(output.valid, true);
    assert.equal(output.counts.cots, 1);
    assert.equal(output.counts.attachments, 1);
    assert.equal(output.counts.files, 0);
});

test('cli package validate reports embedded cot uid and schema error', async () => {
    const pkg = new DataPackage();

    try {
        const cot = await CoTParser.from_geojson({
            type: 'Feature',
            id: 'broken-cot-1',
            properties: {
                type: 'a-f-G-U-C'
            },
            geometry: {
                type: 'Point',
                coordinates: [0, 0]
            }
        });

        pkg.settings.uid = 'broken-package-1';
        pkg.settings.name = 'Broken Package';
        await pkg.addCoT(cot);
        await fs.writeFile(
            path.join(pkg.path, 'raw', 'broken-cot-1', 'broken-cot-1.cot'),
            [
                '<event version="2.0" uid="broken-cot-1" how="m-g" time="2024-01-01T00:00:00.000Z" start="2024-01-01T00:00:00.000Z" stale="2024-01-01T00:10:00.000Z">',
                '    <point lat="0" lon="0" hae="0" ce="9999999.0" le="9999999.0"/>',
                '</event>'
            ].join('\n')
        );

        const zipPath = await pkg.finalize();
        const result = await runCLI(['package', 'validate', zipPath]);

        assert.equal(result.code, 1);
        assert.equal(result.stdout, '');

        const output = JSON.parse(result.stderr);
        assert.equal(output.valid, false);
        assert.equal(output.errors[0].uid, 'broken-cot-1');
        assert.ok(String(output.errors[0].error).includes('must have required property'));
    } finally {
        await pkg.destroy();
    }
});