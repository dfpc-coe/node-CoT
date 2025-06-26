import Util from '../utils/util.js'
import CoT from '../cot.js';
import type JSONCoT from '../types/types.js';
import type { Static } from '@sinclair/typebox';

export class ForceDelete extends CoT {
    constructor(uid: string) {
        const cot: Static<typeof JSONCoT> = {
            event: {
                _attributes: Util.cot_event_attr('t-x-d-d', 'm-g'),
                point: Util.cot_point(),
                detail: {
                    link: {
                        _attributes: {
                            uid: uid,
                            type: 'none',
                            relation: 'none'
                        }
                    },
                    __forcedelete: {}
                }
            }
        };

        super(cot)

        this.uid(uid);
    }
}
