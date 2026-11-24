import type { ChatHierarchyNode } from '../types/feature.js';

type RawHierarchyNode = {
    _attributes?: { uid?: unknown; name?: unknown };
    group?: unknown;
    contact?: unknown;
};

function isRawNode(raw: unknown): raw is RawHierarchyNode {
    return typeof raw === 'object' && raw !== null;
}

function rawNodes(raw: unknown): Array<RawHierarchyNode> {
    if (Array.isArray(raw)) return raw.filter((item) => isRawNode(item));
    return isRawNode(raw) ? [raw] : [];
}

function toNode(raw: RawHierarchyNode, type: 'group' | 'contact'): ChatHierarchyNode | undefined {
    const uid = raw._attributes?.uid;
    const name = raw._attributes?.name;

    if (typeof uid !== 'string' || typeof name !== 'string') return undefined;

    const node: ChatHierarchyNode = { uid, name, type };

    if (type === 'group') {
        node.children = [
            ...rawNodes(raw.group).map((child) => toNode(child, 'group')),
            ...rawNodes(raw.contact).map((child) => toNode(child, 'contact'))
        ].filter((child) => child !== undefined);
    }

    return node;
}

/**
 * Convert the `<hierarchy>` of a `__chat` detail into a tree of groups & contacts
 */
export function chatHierarchy(raw: unknown): ChatHierarchyNode | undefined {
    if (!isRawNode(raw)) return undefined;

    const roots = rawNodes(raw.group);
    if (roots.length === 0) return undefined;

    const root = roots[0];

    return toNode(root, 'group');
}

type HierarchyDetail = {
    _attributes: { uid: string; name: string };
    group?: Array<HierarchyDetail>;
    contact?: Array<HierarchyDetail>;
};

function toDetail(node: ChatHierarchyNode): HierarchyDetail {
    const detail: HierarchyDetail = {
        _attributes: { uid: node.uid, name: node.name }
    };

    const children = node.children ?? [];
    const groups = children.filter((child) => child.type === 'group');
    const contacts = children.filter((child) => child.type === 'contact');

    if (groups.length > 0) detail.group = groups.map((group) => toDetail(group));
    if (contacts.length > 0) detail.contact = contacts.map((contact) => toDetail(contact));

    return detail;
}

/**
 * Convert a tree of groups & contacts into the `<hierarchy>` of a `__chat` detail
 */
export function chatHierarchyDetail(root: ChatHierarchyNode): { group: HierarchyDetail } {
    return { group: toDetail(root) };
}

/**
 * Every contact below a node of a hierarchy, regardless of how deeply it is nested
 */
export function chatHierarchyContacts(node: ChatHierarchyNode): Array<{ uid: string; callsign: string }> {
    const contacts = new Map<string, { uid: string; callsign: string }>();

    const walk = (current: ChatHierarchyNode): void => {
        if (current.type === 'contact') {
            contacts.set(current.uid, { uid: current.uid, callsign: current.name });
        }

        for (const child of current.children ?? []) walk(child);
    };

    walk(node);

    return [...contacts.values()];
}

/**
 * Find a group by UID anywhere in a hierarchy
 */
export function chatHierarchyGroup(node: ChatHierarchyNode, uid: string): ChatHierarchyNode | undefined {
    if (node.type === 'group' && node.uid === uid) return node;

    for (const child of node.children ?? []) {
        const found = chatHierarchyGroup(child, uid);
        if (found) return found;
    }

    return undefined;
}

/**
 * UID of the group that directly contains the group with the given UID
 */
export function chatHierarchyParent(node: ChatHierarchyNode, uid: string): string | undefined {
    for (const child of node.children ?? []) {
        if (child.type === 'group' && child.uid === uid) return node.uid;

        const found = chatHierarchyParent(child, uid);
        if (found) return found;
    }

    return undefined;
}
