import type { Static, TSchema, TUnknown } from '@sinclair/typebox'
import { Value } from '@sinclair/typebox/value'

export type TypeOpts = {
    verbose?: boolean;
    default?: boolean;
    convert?: boolean;
    clean?: boolean;
}

export default class TypeValidator {
    /**
     * Arbitrary JSON objects occasionally need to get typed as part of an ETL
     * This function provides the ability to strictly type unknown objects at runtime
     */
    static type<T extends TSchema = TUnknown>(
        type: T,
        body: unknown,
        opts?: TypeOpts
    ): Static<T> {
        opts ??= {};
        opts.verbose ??= false;
        opts.default ??= true;
        opts.convert ??= true;
        opts.clean ??= true;

        if (opts.default) {
            Value.Default(type, body)
        }

        if (opts.clean) {
            Value.Clean(type, body)
        }

        if (opts.convert) {
            Value.Convert(type, body)
        }

        const result = Value.Check(type, body)

        if (result) return body;

        const errors = Value.Errors(type, body);

        const firstError = errors.First();

        if (opts.verbose) {
            throw new Error(`Internal Validation Error: ${JSON.stringify(firstError)} -- Body: ${JSON.stringify(body)}`);
        } else {
            throw new Error(`Internal Validation Error`);
        }
    }
}
