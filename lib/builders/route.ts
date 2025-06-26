import Util from '../utils/util.js'
import CoT from '../cot.js';
import type JSONCoT from '../types/types.js';
import type { Static } from '@sinclair/typebox';

export class Route extends CoT {
    constructor(cot?: CoT) {
        if (cot) {
            if (cot.type() !== 'b-m-r') {
                throw new Error('Invalid CoT type for Route');
            }

            super(cot.raw)
        } else {
            const cot: Static<typeof JSONCoT> = {
                event: {
                    _attributes: Util.cot_event_attr('b-m-r', 'h-e'),
                    point: Util.cot_point(),
                    detail: {
                    }
                }
            };

            super(cot)
        }
    }
}
