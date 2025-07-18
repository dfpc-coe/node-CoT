import Util from '../utils/util.js'
import CoT from '../cot.js';
import type JSONCoT from '../types/types.js';
import type { FileShareAttributes } from '../types/types.js';
import type { Static } from '@sinclair/typebox';

export class FileShare extends CoT {
    constructor(fileshare: Static<typeof FileShareAttributes>) {
        const cot: Static<typeof JSONCoT> = {
            event: {
                _attributes: Util.cot_event_attr('b-f-t-r', 'h-e'),
                point: Util.cot_point(),
                detail: {
                    fileshare: {
                        _attributes: fileshare
                    }
                }
            }
        };

        super(cot)
    }
}
