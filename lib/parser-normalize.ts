export type ParsedAttributeVisitor = (
    attributeKey: string,
    attributeValue: unknown,
    attributes: Record<string, unknown>,
    path: string[]
) => void;

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

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

    if (!isRecord(input)) {
        return;
    }

    for (const [key, value] of Object.entries(input)) {
        if (key === '_attributes' && isRecord(value)) {
            for (const [attributeKey, attributeValue] of Object.entries(value)) {
                visitor(attributeKey, attributeValue, value, [...path, key]);
                visitElementAttributes(value[attributeKey], visitor, [...path, key, attributeKey]);
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

/**
 * xml-js leaves a circular `_parent` reference on every element that is still
 * open when the input ends
 */
export function hasUnclosedElements(input: unknown): boolean {
    if (Array.isArray(input)) {
        return input.some((value) => hasUnclosedElements(value));
    }

    if (!isRecord(input)) {
        return false;
    }

    if ('_parent' in input) {
        return true;
    }

    return Object.values(input).some((value) => hasUnclosedElements(value));
}
