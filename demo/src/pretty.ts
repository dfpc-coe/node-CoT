const INDENT = '    ';

const TOKEN = /<!--[\s\S]*?-->|<!\[CDATA\[[\s\S]*?\]\]>|<\?[\s\S]*?\?>|<(?:[^<>"']|"[^"]*"|'[^']*')*>|[^<]+/g;

type Kind = 'open' | 'close' | 'self' | 'text' | 'other';

function kind(token: string): Kind {
    if (!token.startsWith('<')) return 'text';
    if (token.startsWith('</')) return 'close';
    if (token.startsWith('<!') || token.startsWith('<?')) return 'other';
    if (token.endsWith('/>')) return 'self';
    return 'open';
}

function prettyXML(text: string): string | null {
    const doc = new DOMParser().parseFromString(text, 'application/xml');
    if (doc.querySelector('parsererror')) return null;

    const tokens = text.match(TOKEN) ?? [];
    if (tokens.join('') !== text) return null;

    const lines: string[] = [];
    let depth = 0;

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        const type = kind(token);

        if (type === 'text') {
            if (token.trim()) lines.push(INDENT.repeat(depth) + token.trim());
        } else if (type === 'close') {
            depth = Math.max(depth - 1, 0);
            lines.push(INDENT.repeat(depth) + token);
        } else if (type === 'open') {
            let end = i + 1;
            while (end < tokens.length && (kind(tokens[end]) === 'text' || tokens[end].startsWith('<![CDATA['))) end++;

            const inner = tokens.slice(i + 1, end).join('');

            if (end < tokens.length && kind(tokens[end]) === 'close') {
                lines.push(INDENT.repeat(depth) + token + (inner.trim() ? inner : '') + tokens[end]);
                i = end;
            } else {
                lines.push(INDENT.repeat(depth) + token);
                depth++;
            }
        } else {
            lines.push(INDENT.repeat(depth) + token);
        }
    }

    return lines.join('\n');
}

function prettyJSON(text: string): string | null {
    try {
        return JSON.stringify(JSON.parse(text), null, INDENT);
    } catch {
        return null;
    }
}

export function pretty(text: string): string {
    const trimmed = text.trim();

    if (trimmed.startsWith('<')) return prettyXML(trimmed) ?? text;
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) return prettyJSON(trimmed) ?? text;

    return text;
}
