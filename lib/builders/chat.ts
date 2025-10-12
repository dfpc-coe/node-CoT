import Util from '../utils/util.js'
import CoT from '../cot.js';
import type JSONCoT from '../types/types.js';
import type { Static } from '@sinclair/typebox';
import { v4 as randomUUID } from 'uuid';

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
