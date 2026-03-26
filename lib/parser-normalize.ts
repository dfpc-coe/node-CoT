export type ParsedAttributeVisitor = (
    attributeKey: string,
    attributeValue: unknown,
    attributes: Record<string, unknown>,
    path: string[]
) => void;

export function visitElementAttributes(
    input: unknown,
    visitor: ParsedAttributeVisitor,
    path: string[] = []
): void {
    if (Array.isArray(input)) {
        for (const [index, value] of input.entries()) {
            visitElementAttributes(value, visitor, [...path, String(index)]);
        }

        return;
    }

    if (!input || typeof input !== 'object') {
        return;
    }

    const record = input as Record<string, unknown>;
    for (const [key, value] of Object.entries(record)) {
        if (key === '_attributes' && value && typeof value === 'object' && !Array.isArray(value)) {
            const attributes = value as Record<string, unknown>;

            for (const [attributeKey, attributeValue] of Object.entries(attributes)) {
                visitor(attributeKey, attributeValue, attributes, [...path, key]);
                visitElementAttributes(attributes[attributeKey], visitor, [...path, key, attributeKey]);
            }

            continue;
        }

        visitElementAttributes(value, visitor, [...path, key]);
    }
}

export function normalizeBooleanAttributeValues(input: unknown): void {
    visitElementAttributes(input, (attributeKey, attributeValue, attributes) => {
        if (typeof attributeValue !== 'string') {
            return;
        }

        const normalized = attributeValue.toLowerCase();
        if (normalized === 'true') {
            attributes[attributeKey] = true;
        } else if (normalized === 'false') {
            attributes[attributeKey] = false;
        }
    });
}