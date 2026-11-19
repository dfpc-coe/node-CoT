import AJV from 'ajv';
import { xml2js, js2xml } from '@tak-ps/xml-js';
import { Value } from '@sinclair/typebox/value';
import type { ValueError } from '@sinclair/typebox/value';
import type { Static } from '@sinclair/typebox';
import JSONCoT from '../../lib/types/types.js';
import { InputFeature } from '../../lib/types/feature.js';
import { hasUnclosedElements, normalizeBooleanAttributeValues } from '../../lib/parser-normalize.js';
import { to_geojson } from '../../lib/parser/to_geojson.js';
import { from_geojson } from '../../lib/parser/from_geojson.js';
import CoT from '../../lib/cot.js';
import { lineAtOffset, lineCount, locateJSON, locateXML, resolveLine } from './locate.js';
import type { LineIndex } from './locate.js';

export type Format = 'xml' | 'geojson';

export type Stage = 'parse' | 'schema' | 'convert';

export interface Issue {
    stage: Stage;
    path: string;
    message: string;
    line: number;
}

export interface ValidationResult {
    format: Format;
    valid: boolean;
    issues: Issue[];
    output?: {
        label: string;
        text: string;
    };
}

type Finding = Omit<Issue, 'line'>;

const MAX_ISSUES = 50;

const checkCoT = new AJV({
    allErrors: true,
    coerceTypes: true,
    allowUnionTypes: true
}).compile(JSONCoT);

function message(err: unknown): string {
    return err instanceof Error ? err.message : String(err);
}

function located(findings: Finding[], index: LineIndex): Issue[] {
    const seen = new Set<string>();
    const issues: Issue[] = [];

    for (const finding of findings) {
        const key = `${finding.stage}|${finding.path}|${finding.message}`;
        if (seen.has(key)) continue;
        seen.add(key);

        issues.push({ ...finding, line: resolveLine(index, finding.path) });
    }

    return issues
        .toSorted((a, b) => a.line - b.line)
        .slice(0, MAX_ISSUES);
}

function schemaFindings(raw: unknown): Finding[] {
    checkCoT(raw);

    return (checkCoT.errors ?? []).map((error) => {
        return {
            stage: 'schema' as const,
            path: error.instancePath || '/',
            message: error.message ?? 'Invalid'
        };
    });
}

// A union failure only says "Expected union value" - the useful detail is in
// the per-branch errors, so report the branch that got furthest
function featureFindings(errors: Iterable<ValueError>): Finding[] {
    const findings: Finding[] = [];

    for (const error of errors) {
        const branches = error.errors.map((branch) => featureFindings(branch));

        if (branches.length) {
            findings.push(...branches.reduce((best, branch) => branch.length < best.length ? branch : best));
        } else {
            findings.push({ stage: 'schema', path: error.path || '/', message: error.message });
        }
    }

    return findings;
}

export function detectFormat(input: string): Format | null {
    const trimmed = input.trimStart();

    if (trimmed.startsWith('<')) return 'xml';
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) return 'geojson';

    return null;
}

async function validateXML(input: string): Promise<ValidationResult> {
    const result: ValidationResult = { format: 'xml', valid: false, issues: [] };
    const { index, unclosed } = locateXML(input);

    let parsed: unknown;
    try {
        parsed = xml2js(input, { compact: true });
    } catch (err) {
        // sax reports a zero-based "Line: N" on the lines after its message
        const [summary, ...detail] = message(err).split('\n');
        const line = /Line: (\d+)/.exec(detail.join('\n'));

        result.issues.push({
            stage: 'parse',
            path: '/',
            message: `Malformed XML: ${summary}`,
            line: line ? Number(line[1]) + 1 : lineCount(input)
        });
        return result;
    }

    if (hasUnclosedElements(parsed)) {
        result.issues.push({
            stage: 'parse',
            path: '/',
            message: 'Malformed XML: element is never closed',
            line: unclosed ?? lineCount(input)
        });
        return result;
    }

    if (typeof parsed !== 'object' || parsed === null || !('event' in parsed)) {
        result.issues.push({ stage: 'parse', path: '/', message: 'Document has no root <event> element', line: resolveLine(index, '/') });
        return result;
    }

    normalizeBooleanAttributeValues(parsed);

    result.issues = located(schemaFindings(parsed), index);
    if (result.issues.length) return result;

    try {
        const feature = await to_geojson(new CoT(parsed as Static<typeof JSONCoT>));

        result.output = {
            label: 'GeoJSON Feature',
            text: JSON.stringify(feature, null, 4)
        };
    } catch (err) {
        result.issues = located([{ stage: 'convert', path: '/', message: message(err) }], index);
        return result;
    }

    result.valid = true;

    return result;
}

async function validateGeoJSON(input: string): Promise<ValidationResult> {
    const result: ValidationResult = { format: 'geojson', valid: false, issues: [] };

    let parsed: unknown;
    try {
        parsed = JSON.parse(input);
    } catch (err) {
        const text = message(err);
        const line = /line (\d+)/.exec(text);
        const position = /position (\d+)/.exec(text);

        result.issues.push({
            stage: 'parse',
            path: '/',
            message: `Malformed JSON: ${text}`,
            line: line ? Number(line[1]) : position ? lineAtOffset(input, Number(position[1])) : lineCount(input)
        });
        return result;
    }

    const index = locateJSON(input);

    if (typeof parsed !== 'object' || parsed === null || (parsed as { type?: unknown }).type !== 'Feature') {
        result.issues = located([{ stage: 'parse', path: '/type', message: 'Expected a single GeoJSON Feature' }], index);
        return result;
    }

    const body: unknown = structuredClone(parsed);
    Value.Default(InputFeature, body);
    Value.Clean(InputFeature, body);
    Value.Convert(InputFeature, body);

    result.issues = located(featureFindings(Value.Errors(InputFeature, body)), index);
    if (result.issues.length) return result;

    try {
        const cot = await from_geojson(structuredClone(parsed) as Static<typeof InputFeature>);

        result.issues = located(schemaFindings(cot.raw).map((finding) => {
            return { ...finding, stage: 'convert' as const, message: `Converted CoT ${finding.path}: ${finding.message}`, path: '/' };
        }), index);
        if (result.issues.length) return result;

        result.output = {
            label: 'CoT XML',
            text: js2xml(cot.raw, { compact: true, spaces: 4 })
        };
    } catch (err) {
        result.issues = located([{ stage: 'convert', path: '/', message: message(err) }], index);
        return result;
    }

    result.valid = true;

    return result;
}

export async function validate(input: string): Promise<ValidationResult | null> {
    const format = detectFormat(input);

    if (!format) return null;

    try {
        return await (format === 'xml' ? validateXML(input) : validateGeoJSON(input));
    } catch (err) {
        return {
            format,
            valid: false,
            issues: [{ stage: 'parse', path: '/', message: message(err), line: 1 }]
        };
    }
}
