import Util from '../utils/util.js'
import CoT from '../cot.js';
import type JSONCoT from '../types/types.js';
import type { Static } from '@sinclair/typebox';
import { v4 as randomUUID } from 'uuid';

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
        const messageId = chat.messageId || randomUUID();

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

        if (!cot.event.detail) cot.event.detail = {};

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
        const cot: Static<typeof JSONCoT> = {
            event: {
                _attributes: Util.cot_event_attr('b-t-f', 'h-g-i-g-o'),
                point: Util.cot_point(),
                detail: {
                    __chat: {
                        _attributes: {
                            parent: chat.parent || 'RootContactGroup',
                            groupOwner: chat.groupOwner ? 'true' : 'false',
                            messageId: chat.messageId || randomUUID(),
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

        cot.event._attributes.uid = `GeoChat.${chat.from.uid}.${chat.to.uid}.${randomUUID()}`;

        if (!cot.event.detail) cot.event.detail = {};

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
