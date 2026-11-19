export type LineIndex = Map<string, number>;

function lineStarts(text: string): number[] {
    const starts = [0];

    for (let i = 0; i < text.length; i++) {
        if (text[i] === '\n') starts.push(i + 1);
    }

    return starts;
}

function lineOf(starts: number[], offset: number): number {
    let low = 0;
    let high = starts.length - 1;

    while (low < high) {
        const mid = Math.ceil((low + high) / 2);
        if (starts[mid] <= offset) low = mid;
        else high = mid - 1;
    }

    return low + 1;
}

export function lineAtOffset(text: string, offset: number): number {
    return lineOf(lineStarts(text), offset);
}

export function lineCount(text: string): number {
    return lineStarts(text).length;
}

/**
 * Line of the deepest located ancestor of a path, so an error on a missing or
 * unlocatable node lands on the element that should have contained it
 */
export function resolveLine(index: LineIndex, path: string): number {
    const segments = path.split('/').filter(Boolean);

    while (segments.length) {
        const line = index.get(`/${segments.join('/')}`);
        if (line !== undefined) return line;
        segments.pop();
    }

    return index.get('/') ?? 1;
}

interface OpenElement {
    paths: string[];
    line: number;
    children: Map<string, number>;
}

function skipTo(text: string, from: number, terminator: string): number {
    const end = text.indexOf(terminator, from);
    return end === -1 ? text.length : end + terminator.length;
}

function tagEnd(text: string, from: number): number {
    let quote = '';

    for (let i = from; i < text.length; i++) {
        const char = text[i];

        if (quote) {
            if (char === quote) quote = '';
        } else if (char === '"' || char === "'") {
            quote = char;
        } else if (char === '>') {
            return i;
        }
    }

    return text.length;
}

/**
 * Map the paths of xml-js compact output (the paths schema errors are reported
 * against) to the source line of the element or attribute they came from
 */
export function locateXML(text: string): { index: LineIndex, unclosed?: number } {
    const starts = lineStarts(text);
    const index: LineIndex = new Map();
    const stack: OpenElement[] = [{ paths: [''], line: 1, children: new Map() }];

    let pos = text.indexOf('<');

    while (pos !== -1 && pos < text.length) {
        let next: number;

        if (text.startsWith('<!--', pos)) {
            next = skipTo(text, pos, '-->');
        } else if (text.startsWith('<![CDATA[', pos)) {
            next = skipTo(text, pos, ']]>');
        } else if (text.startsWith('<?', pos)) {
            next = skipTo(text, pos, '?>');
        } else if (text.startsWith('<!', pos)) {
            next = skipTo(text, pos, '>');
        } else if (text.startsWith('</', pos)) {
            if (stack.length > 1) stack.pop();
            next = skipTo(text, pos, '>');
        } else {
            const end = tagEnd(text, pos + 1);
            const body = text.slice(pos + 1, end);
            const name = /^[^\s/>]+/.exec(body)?.[0];

            if (name) {
                const parent = stack[stack.length - 1];
                const position = parent.children.get(name) ?? 0;
                parent.children.set(name, position + 1);

                const line = lineOf(starts, pos);
                const paths: string[] = [];

                // A repeated element becomes an array, so it is addressed with
                // and without its position depending on its siblings
                for (const prefix of parent.paths) {
                    paths.push(`${prefix}/${name}/${position}`);
                    if (position === 0) paths.push(`${prefix}/${name}`);
                }

                for (const path of paths) {
                    if (!index.has(path)) index.set(path, line);
                }

                if (!index.has('/')) index.set('/', line);

                for (const attribute of body.matchAll(/([^\s=/]+)\s*=\s*(?:"[^"]*"|'[^']*')/g)) {
                    const attributeLine = lineOf(starts, pos + 1 + attribute.index);

                    for (const path of paths) {
                        const key = `${path}/_attributes/${attribute[1]}`;
                        if (!index.has(key)) index.set(key, attributeLine);
                    }
                }

                if (end < text.length && !body.endsWith('/')) {
                    stack.push({ paths, line, children: new Map() });
                } else if (end >= text.length) {
                    return { index, unclosed: line };
                }
            }

            next = end + 1;
        }

        pos = text.indexOf('<', next);
    }

    return {
        index,
        unclosed: stack.length > 1 ? stack[stack.length - 1].line : undefined
    };
}

/**
 * Map JSON Pointers to the source line of the member or array item they address
 */
export function locateJSON(text: string): LineIndex {
    const starts = lineStarts(text);
    const index: LineIndex = new Map();

    let pos = 0;

    const whitespace = (): void => {
        while (pos < text.length && /\s/.test(text[pos])) pos++;
    };

    const string = (): string => {
        const start = pos;
        pos++;

        while (pos < text.length && text[pos] !== '"') {
            pos += text[pos] === '\\' ? 2 : 1;
        }

        pos++;

        try {
            return String(JSON.parse(text.slice(start, pos)));
        } catch {
            return text.slice(start + 1, pos - 1);
        }
    };

    const value = (path: string): void => {
        whitespace();

        if (!index.has(path || '/')) index.set(path || '/', lineOf(starts, pos));

        const char = text[pos];

        if (char === '{') {
            pos++;

            while (pos < text.length) {
                whitespace();
                if (text[pos] === '}') break;
                if (text[pos] !== '"') return;

                const line = lineOf(starts, pos);
                const key = `${path}/${string().replaceAll('~', '~0').replaceAll('/', '~1')}`;
                index.set(key, line);

                whitespace();
                if (text[pos] !== ':') return;
                pos++;

                value(key);

                whitespace();
                if (text[pos] !== ',') break;
                pos++;
            }

            pos++;
        } else if (char === '[') {
            pos++;

            for (let item = 0; pos < text.length; item++) {
                whitespace();
                if (text[pos] === ']') break;

                value(`${path}/${item}`);

                whitespace();
                if (text[pos] !== ',') break;
                pos++;
            }

            pos++;
        } else if (char === '"') {
            string();
        } else {
            while (pos < text.length && !/[\s,\]}]/.test(text[pos])) pos++;
        }
    };

    value('');

    return index;
}
