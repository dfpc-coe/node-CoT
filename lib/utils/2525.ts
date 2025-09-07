import { convertLetterSidc2NumberSidc } from "@orbat-mapper/convert-symbology";

export enum Domain {
    ATOM = 'a',
    BITS = 'b',
    REFERENCE = 'r',
    TASK = 't',
    CAPABILITY = 'c',
    REPLY = 'y',
}

export enum StandardIdentity {
    PENDING = 'p',
    UNKNOWN = 'u',
    ASSUMED_FRIEND = 'a',
    FRIEND = 'f',
    NEUTRAL = 'n',
    SUSPECT = 's',
    HOSTILE = 'h',
    JOKER = 'j',
    FAKER = 'k',
    NONE = 'o'
}

export const SID_MAP: Record<string, string> = {
    P: "00", // pending
    U: "01", // unknown
    A: "02", // assumed friend
    F: "03", // friend
    N: "04", // neutral
    S: "05", // suspect
    H: "06", // hostile
    G: "10", // exercise pending
    W: "11", // exercise unknown
    M: "12", // exercise assumed friend
    D: "13", // exercise friend
    L: "14", // exercise neutral
    J: "15", // joker
    K: "16", // faker
};

export const STATUS_MAP: Record<string, string> = {
    P: "0", // present
    A: "1", // anticipated/planned
    C: "2", // present fully capable
    D: "3", // present damaged
    X: "4", // present destroyed
    F: "5", // present full to capacity
};

export const DIM_MAP: Record<string, string> = {
    P: '05', // Space
    A: '01', // Air
    G: '10', // Ground
    S: '30', // SeaSurface
    U: '35', // SubSurface
    F: '10', // SOF
    Z: '10', // Unknown
    X: '10'  // Unknown
}

/**
 * @class
 *
 * Convert a COT Atom Type to/from Symbol Identification Code (SIDC)
 * Migrated to TypeScript from the original Kotlin verison
 * @ https://github.com/cyberpython/kotcot under the MIT License
 */
export default class Type2525 {
    /**
     * Check a given COT Type to see if it is compatible with conversion to SIDC
     *
     * @param cotType - Cursor On Target Type to test
     */
    static is2525BConvertable(cotType: string): boolean {
        return !!cotType.match(/^a-[PUAFNSHJKOXpuafnshjkox]-[PAGSUFXZ](-\w+)*$/);
    }

    static domain(cotType: string): Domain {
        const unknownDomain = cotType.split('-')[0];

        const d = enumFromStringValue<Domain>(Domain, unknownDomain);
        if (d) {
            return d;
        } else {
            throw new Error('Domain could not be determined');
        }
    }

    static standardIdentity(cotType: string): StandardIdentity {
        if (!cotType.startsWith('a-')) return StandardIdentity.NONE;
        if (cotType.split('-').length < 2) return StandardIdentity.NONE;

        const unknownIdentity = cotType.split('-')[1];

        const si = enumFromStringValue(StandardIdentity, unknownIdentity);

        if (si) {
            return si;
        } else {
            return StandardIdentity.NONE;
        }
    }

    /**
     * Given a COT Atom Type, return an SIDC in 2525D format
     *
     * @param cotType - Cursor On Target Type (Note must start with atomic "a")
     */
    static to2525D(cotType: string): string {
        const str_sidc = this.to2525B(cotType);

        // Handle Short Codes Manually
        if (str_sidc.match(/^S[A-Z]{3}-{11}/)) {
            const AFF = str_sidc[1].toUpperCase()
            const DIM = str_sidc[2].toUpperCase()
            const STS = str_sidc[3].toUpperCase()

            return '12' + SID_MAP[AFF] + DIM_MAP[DIM] + STATUS_MAP[STS] + '0000000000000';
        } else {
            const convert = convertLetterSidc2NumberSidc(str_sidc);

            if (!convert.sidc) {
                throw new Error(`Could not convert 2525B SIDC to 2525D`);
            }

            return convert.sidc;
        }
    }

    /**
     * Given a COT Atom Type, return an SIDC
     *
     * @param cotType - Cursor On Target Type (Note must start with atomic "a")
     */
    static to2525B(cotType: string): string {
        if (!this.is2525BConvertable(cotType)) {
            throw new TypeError("CoT to 2525B can only be applied to well-formed Atom type CoT Events.")
        }

        const m2525bChars = cotType.substring(4).replace(/[^A-Z0-9]+/g, "");
        const m2525bBattleDim = m2525bChars.substring(0, 1);

        const cotAffiliation = cotType.substring(2, 3);
        const m2525bAffiliation = (cotAffiliation === "o" || cotAffiliation === "x")
            ? "U"
            : cotAffiliation.toUpperCase();

            const m2525bFuncId = m2525bChars.length > 1
                ? m2525bChars.substring(1).padEnd(6, "-").substring(0, 6)
                : "------";

        return `S${m2525bAffiliation}${m2525bBattleDim}P${m2525bFuncId}-----`;
    }

    /**
     * Check a given SIDC to see if it is compatible with conversion to CoT Type
     *
     * @param sidc - SIDC to test
     */
    static isTypeConvertable(sidc: string): boolean {
        return !!sidc.match(/^S[PUAFNSHGWMDLJK-][PAGSUFXZ-][AP-][A-Z0-9-]{10}[AECGNS-]$/)
    }

    /**
     * Given an SIDC, return a CoT Type
     *
     * @param sidc - SIDC to convert
     */
    static from2525B(sidc: string) : string {
        if (!this.isTypeConvertable(sidc)) {
            throw new Error("2525B to CoT can only be applied to well-formed warfighting 2525B SIDCs.");
        }

        const m2525bAffiliation = sidc.substring(1, 2);
        const cotAffiliation = ["G", "W", "M", "D", "L"].includes(m2525bAffiliation)
            ? "f"
            : m2525bAffiliation === "-"
                ? "o"
                : m2525bAffiliation.toLowerCase();

                const cotBattleDim = sidc.substring(2, 3);
                const cotFuncId = Array.from(sidc.substring(4, 10).replace(/[^A-Z0-9]+/g, ""))
                .map((x) => `-${x}`)
                .join("");

        return `a-${cotAffiliation}-${cotBattleDim}${cotFuncId}`;
    }
}

function enumFromStringValue<T> (enm: { [s: string]: T}, value: string): T | undefined {
    return (Object.values(enm) as unknown as string[]).includes(value)
        ? value as unknown as T
        : undefined;
}
