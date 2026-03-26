#!/usr/bin/env tsx

import fs from 'node:fs/promises'
import path from 'node:path'
import { CoTParser, DataPackage } from './index.js'

type CommandHandler = (args: string[]) => Promise<void>

interface PackageIssue {
    entry: string;
    uid?: string;
    error: string;
}

function usage(): string {
    return [
        'Usage:',
        '  ./cli.ts package validate <file>.zip',
        '  ./cli.ts feature convert <input.geojson|input.cot>'
    ].join('\n')
}

function getErrorMessage(err: unknown): string {
    if (err instanceof Error) return err.message;

    return String(err);
}

async function withoutConsoleWarn<T>(fn: () => Promise<T> | T): Promise<T> {
    const warn = console.warn;
    console.warn = () => undefined;

    try {
        return await fn();
    } finally {
        console.warn = warn;
    }
}

function extractUID(raw: string): string | undefined {
    const match = raw.match(/<event\b[^>]*\buid=(['"])([^'"]+)\1/i);

    return match?.[2];
}

function isJSONInput(inputPath: string, raw: string): boolean {
    const ext = path.extname(inputPath).toLowerCase();

    if (ext === '.geojson' || ext === '.json') return true;

    return raw.trimStart().startsWith('{');
}

function normalizeGeoJSON(input: unknown): Record<string, unknown> {
    if (!input || typeof input !== 'object' || Array.isArray(input)) {
        throw new Error('GeoJSON input must be an object');
    }

    const geojson = input as Record<string, unknown>;

    if (geojson.type === 'Feature') {
        return geojson;
    }

    if (geojson.type === 'FeatureCollection') {
        const features = geojson.features;

        if (!Array.isArray(features) || features.length !== 1) {
            throw new Error('FeatureCollection input must contain exactly one feature');
        }

        const [feature] = features;
        if (!feature || typeof feature !== 'object' || Array.isArray(feature)) {
            throw new Error('FeatureCollection contains an invalid feature');
        }

        return feature as Record<string, unknown>;
    }

    throw new Error('GeoJSON input must be a Feature or a single-feature FeatureCollection');
}

async function validatePackage(inputPath: string): Promise<void> {
    const resolved = path.resolve(inputPath);
    let pkg: DataPackage | undefined;

    try {
        pkg = await withoutConsoleWarn(async () => {
            return await DataPackage.parse(resolved, {
                cleanup: false,
                strict: true
            });
        });

        const issues: PackageIssue[] = [];

        for (const content of pkg.contents) {
            const entry = content._attributes.zipEntry;
            const buffer = await pkg.getFileBuffer(entry);

            if (path.extname(entry).toLowerCase() !== '.cot') continue;

            const raw = buffer.toString('utf8');
            try {
                await withoutConsoleWarn(() => CoTParser.from_xml(raw));
            } catch (err) {
                issues.push({
                    entry,
                    uid: extractUID(raw),
                    error: getErrorMessage(err)
                });
            }
        }

        if (issues.length) {
            console.error(JSON.stringify({
                valid: false,
                package: resolved,
                errors: issues
            }, null, 4));

            process.exitCode = 1;
            return;
        }

        const cots = await pkg.cots({
            respectIgnore: false,
            parseAttachments: true
        });

        const attachments = await pkg.attachments({
            respectIgnore: false
        });

        const files = await pkg.files({
            respectIgnore: false
        });

        const attachmentCount = Array.from(attachments.values())
            .reduce((sum, entries) => sum + entries.length, 0);

        console.log(JSON.stringify({
            valid: true,
            package: resolved,
            manifest: pkg.settings,
            counts: {
                contents: pkg.contents.length,
                cots: cots.length,
                attachments: attachmentCount,
                files: files.size
            }
        }, null, 4));
    } finally {
        if (pkg) {
            await pkg.destroy();
        }
    }
}

async function convertFeature(inputPath: string): Promise<void> {
    const resolved = path.resolve(inputPath);
    const raw = await fs.readFile(resolved, 'utf8');

    if (isJSONInput(resolved, raw)) {
        const feature = normalizeGeoJSON(JSON.parse(raw));
        const cot = await withoutConsoleWarn(async () => {
            return await CoTParser.from_geojson(feature as never);
        });
        const xml = CoTParser.to_xml(cot);

        await withoutConsoleWarn(() => CoTParser.from_xml(xml));
        process.stdout.write(`${xml}\n`);
        return;
    }

    const cot = await withoutConsoleWarn(() => CoTParser.from_xml(raw));
    const feature = await CoTParser.to_geojson(cot);

    process.stdout.write(`${JSON.stringify(feature, null, 4)}\n`);
}

const commands: Record<string, CommandHandler> = {
    'package validate': async (args) => {
        if (args.length !== 1) {
            throw new Error('package validate requires a single .zip file path');
        }

        await validatePackage(args[0]);
    },
    'feature convert': async (args) => {
        if (args.length !== 1) {
            throw new Error('feature convert requires a single input path');
        }

        await convertFeature(args[0]);
    }
}

try {
    const args = process.argv.slice(2);

    if (!args.length || args.includes('--help') || args.includes('-h')) {
        console.log(usage());
        process.exit(0);
    }

    const commandKey = args.slice(0, 2).join(' ');
    const handler = commands[commandKey];

    if (!handler) {
        throw new Error(`Unknown command: ${args.join(' ')}`);
    }

    await handler(args.slice(2));
} catch (err) {
    console.error(getErrorMessage(err));
    console.error('');
    console.error(usage());
    process.exit(1);
}
