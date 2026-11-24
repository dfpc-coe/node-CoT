import Util from '../utils/util.js'
import CoT from '../cot.js';
import type JSONCoT from '../types/types.js';
import type { Static } from '@sinclair/typebox';
import type { ChatHierarchyNode } from '../types/feature.js';
import { chatHierarchyDetail, chatHierarchyContacts, chatHierarchyGroup, chatHierarchyParent } from '../utils/chat.js';

export type MissionChatMember = {
    uid: string;
    type?: string;
}

export type MissionChatInput = {
    from: MissionChatMember;
    mission: {
        name: string;
        id: string;
        guid?: string;
    };
    senderCallsign: string;

    message: string;

    parent?: string;
    groupOwner?: boolean;
    messageId?: string;
}

export class MissionChat extends CoT {
    constructor(chat: MissionChatInput) {
        const messageId = chat.messageId || crypto.randomUUID();

        const cot: Static<typeof JSONCoT> = {
            event: {
                _attributes: Util.cot_event_attr('b-t-f', 'h-g-i-g-o'),
                point: Util.cot_point(),
                detail: {
                    __chat: {
                        _attributes: {
                            parent: chat.parent || 'DataSyncMissionsList',
                            groupOwner: chat.groupOwner ? 'true' : 'false',
                            messageId,
                            chatroom: chat.mission.name,
                            id: chat.mission.id,
                            senderCallsign: chat.senderCallsign
                        },
                        chatgrp: {
                            _attributes: {
                                uid0: chat.from.uid,
                                uid1: chat.mission.id,
                                id: chat.mission.id
                            }
                        }
                    },
                }
            }
        }

        cot.event._attributes.uid = `GeoChat.${chat.from.uid}.${chat.mission.id}.${messageId}`;

        cot.event.detail ??= {};

        cot.event.detail.link = {
            _attributes: {
                uid: chat.from.uid,
                type: chat.from.type || 'a-f-G',
                relation: 'p-p'
            }
        }

        cot.event.detail.remarks = {
            _attributes: {
                source: chat.from.uid,
                to: chat.mission.id,
                time: cot.event._attributes.time
            },
            _text: chat.message
        }

        super(cot)

        const dest: Record<string, string> = { mission: chat.mission.name };
        if (chat.mission.guid) dest['mission-guid'] = chat.mission.guid;
        this.addDest(dest);
    }
}

export type DirectChatMember = {
    uid: string;
    callsign: string;
}

export const DirectChatReceiptStatus = {
    delivered: 'b-t-f-d',
    read: 'b-t-f-r',
    pending: 'b-t-f-p',
    failed: 'b-t-f-s'
} as const;

export type DirectChatReceiptInput = {
    to: DirectChatMember;
    from: DirectChatMember;

    status: keyof typeof DirectChatReceiptStatus;
    messageId: string;

    parent?: string;
    chatroom?: string;
    groupOwner?: boolean;
}

/**
 * Delivery/Read Receipt for a DirectChat message
 * The `to` member is the sender of the original message that the receipt
 * refers to and `messageId` is the original message's messageId
 */
export class DirectChatReceipt extends CoT {
    constructor(receipt: DirectChatReceiptInput) {
        const type = DirectChatReceiptStatus[receipt.status];

        const cot: Static<typeof JSONCoT> = {
            event: {
                _attributes: Util.cot_event_attr(type, 'h-g-i-g-o'),
                point: Util.cot_point(),
                detail: {
                    __chatreceipt: {
                        _attributes: {
                            parent: receipt.parent || 'RootContactGroup',
                            groupOwner: receipt.groupOwner ? 'true' : 'false',
                            messageId: receipt.messageId,
                            chatroom: receipt.chatroom || receipt.to.callsign,
                            id: receipt.to.uid,
                            senderCallsign: receipt.from.callsign
                        },
                        chatgrp: {
                            _attributes: {
                                uid0: receipt.from.uid,
                                uid1: receipt.to.uid,
                                id: receipt.to.uid
                            }
                        }
                    },
                }
            }
        }

        // ATAK & WinTAK set the receipt Event UID to the original messageId and
        // ATAK looks the original message up by the receipt's Event UID on receive
        cot.event._attributes.uid = receipt.messageId;

        cot.event.detail ??= {};

        cot.event.detail.link = {
            _attributes: {
                uid: receipt.from.uid,
                type: 'a-f-G',
                relation: 'p-p'
            }
        }

        super(cot)

        this.addDest({
            uid: receipt.to.uid
        })
    }
}

export type DirectChatInput = {
    to: DirectChatMember;
    from: DirectChatMember;

    message: string;

    parent?: string;
    chatroom?: string;
    groupOwner?: boolean;
    messageId?: string;
    id?: string;
}

export class DirectChat extends CoT {
    constructor(chat: DirectChatInput) {
        const messageId = chat.messageId || crypto.randomUUID();

        const cot: Static<typeof JSONCoT> = {
            event: {
                _attributes: Util.cot_event_attr('b-t-f', 'h-g-i-g-o'),
                point: Util.cot_point(),
                detail: {
                    __chat: {
                        _attributes: {
                            parent: chat.parent || 'RootContactGroup',
                            groupOwner: chat.groupOwner ? 'true' : 'false',
                            messageId,
                            chatroom: chat.chatroom || chat.to.callsign,
                            id: chat.to.uid,
                            senderCallsign: chat.from.callsign
                        },
                        chatgrp: {
                            _attributes: {
                                uid0: chat.from.uid,
                                uid1: chat.to.uid,
                                id:  chat.to.uid
                            }
                        }
                    },
                }
            }
        }

        cot.event._attributes.uid = `GeoChat.${chat.from.uid}.${chat.to.uid}.${messageId}`;

        cot.event.detail ??= {};

        cot.event.detail.link = {
            _attributes: {
                uid: chat.from.uid,
                type: 'a-f-G',
                relation: 'p-p'
            }
        }

        cot.event.detail.remarks = {
            _attributes: {
                source: chat.from.uid,
                to: chat.to.uid,
                time: cot.event._attributes.time
            },
            _text: chat.message
        }

        super(cot)

        this.addDest({
            uid: chat.to.uid
        })

    }
}

export type GroupChatInput = {
    from: DirectChatMember;
    group: {
        id: string;
        name: string;
    };

    /**
     * Every other member of the group - the message is addressed to each of them
     * Omit to broadcast to everyone the sender shares a channel with (ie: "All Chat Rooms")
     */
    members?: Array<DirectChatMember>;

    /**
     * Full tree of the top level user group that `group` belongs to, rooted at `UserGroups`,
     * in the form `to_geojson` returns as `chat.hierarchy` - required to address a nested group
     * If `members` is omitted the message is addressed to every contact below `group` in the tree
     */
    hierarchy?: ChatHierarchyNode;

    message: string;

    parent?: string;

    /**
     * Only set by the creator of the group - recipients replace the membership
     * of the group with the `hierarchy` of a message from its owner
     */
    groupOwner?: boolean;

    /**
     * UID of a child group that the sender deleted from `group`
     */
    deleteChild?: string;
    messageId?: string;
}

export const GroupChatParent = {
    root: 'RootContactGroup',
    user: 'UserGroups',
    team: 'TeamGroups'
} as const;

/**
 * GeoChat message to a Group
 *
 * User created groups (parent `UserGroups`) carry the group's `hierarchy` so that
 * a recipient that has never seen the group can create it with the right members
 */
export class GroupChat extends CoT {
    constructor(chat: GroupChatInput) {
        const messageId = chat.messageId || crypto.randomUUID();
        const addressed = chat.hierarchy ? chatHierarchyGroup(chat.hierarchy, chat.group.id) : undefined;
        const members = (chat.members ?? (addressed ? chatHierarchyContacts(addressed) : []))
            .filter((member) => member.uid !== chat.from.uid);
        const broadcast = members.length === 0;
        const parent = chat.parent
            || (chat.hierarchy ? chatHierarchyParent(chat.hierarchy, chat.group.id) : undefined)
            || (broadcast ? GroupChatParent.root : GroupChatParent.user);

        const chatgrp: Record<string, string> = {
            uid0: chat.from.uid,
            id: chat.group.id
        };

        if (!broadcast) {
            members.forEach((member, i) => {
                chatgrp[`uid${i + 1}`] = member.uid;
            });
        } else {
            chatgrp.uid1 = chat.group.id;
        }

        const cot: Static<typeof JSONCoT> = {
            event: {
                _attributes: Util.cot_event_attr('b-t-f', 'h-g-i-g-o'),
                point: Util.cot_point(),
                detail: {
                    __chat: {
                        _attributes: {
                            parent,
                            groupOwner: chat.groupOwner ? 'true' : 'false',
                            messageId,
                            chatroom: chat.group.name,
                            id: chat.group.id,
                            senderCallsign: chat.from.callsign,
                            ...(chat.deleteChild ? { deleteChild: chat.deleteChild } : {})
                        },
                        chatgrp: {
                            _attributes: chatgrp
                        }
                    },
                }
            }
        }

        cot.event._attributes.uid = `GeoChat.${chat.from.uid}.${chat.group.id}.${messageId}`;

        cot.event.detail ??= {};

        if (cot.event.detail.__chat && chat.hierarchy) {
            cot.event.detail.__chat.hierarchy = chatHierarchyDetail(chat.hierarchy);
        } else if (cot.event.detail.__chat && !broadcast && parent === GroupChatParent.user) {
            cot.event.detail.__chat.hierarchy = chatHierarchyDetail({
                uid: GroupChatParent.user,
                name: 'Groups',
                type: 'group',
                children: [{
                    uid: chat.group.id,
                    name: chat.group.name,
                    type: 'group',
                    children: [chat.from, ...members].map((member) => ({
                        uid: member.uid,
                        name: member.callsign,
                        type: 'contact' as const
                    }))
                }]
            });
        }

        cot.event.detail.link = {
            _attributes: {
                uid: chat.from.uid,
                type: 'a-f-G',
                relation: 'p-p'
            }
        }

        cot.event.detail.remarks = {
            _attributes: {
                source: chat.from.uid,
                ...(broadcast ? { to: chat.group.id } : {}),
                time: cot.event._attributes.time
            },
            _text: chat.message
        }

        super(cot)

        for (const member of members) {
            this.addDest({
                uid: member.uid
            })
        }
    }
}
