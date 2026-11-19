import { convertLetterSidc2NumberSidc, convertNumberSidc2LetterSidc } from "@orbat-mapper/convert-symbology";

/**
 * Digits 1-2 of a numeric SIDC are the Version field - "10" is 2525D
 *
 * TAK Clients dispatch to a symbology provider based on this field
 * (10 => APP6-D, 11 => 2525D, 13 => 2525E, 15 => 2525E Ch1) and fall back to
 * 2525C - where a numeric SIDC is never a valid symbol - when the version is
 * unknown to them, resulting in no symbol being rendered at all
 */
export const VERSION_2525D = '10';

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
    // pending
    P: "00",
    // unknown
    U: "01",
    // assumed friend
    A: "02",
    // friend
    F: "03",
    // neutral
    N: "04",
    // suspect
    S: "05",
    // hostile
    H: "06",
    // exercise pending
    G: "10",
    // exercise unknown
    W: "11",
    // exercise assumed friend
    M: "12",
    // exercise friend
    D: "13",
    // exercise neutral
    L: "14",
    // joker
    J: "15",
    // faker
    K: "16",
};

export const STATUS_MAP: Record<string, string> = {
    // present
    P: "0",
    // anticipated/planned
    A: "1",
    // present fully capable
    C: "2",
    // present damaged
    D: "3",
    // present destroyed
    X: "4",
    // present full to capacity
    F: "5",
};

export const DIM_MAP: Record<string, string> = {
    // Space
    P: '05',
    // Air
    A: '01',
    // Ground
    G: '10',
    // SeaSurface
    S: '30',
    // SubSurface
    U: '35',
    // SOF
    F: '10',
    // Unknown
    Z: '10',
    // Unknown
    X: '10'
}

export const SID_REVERSE_MAP: Record<string, string> = {
    // pending
    '00': 'p',
    // unknown
    '01': 'u',
    // assumed friend
    '02': 'a',
    // friend
    '03': 'f',
    // neutral
    '04': 'n',
    // suspect
    '05': 's',
    // hostile
    '06': 'h',
    // exercise pending
    '10': 'p',
    // exercise unknown
    '11': 'u',
    // exercise assumed friend
    '12': 'a',
    // exercise friend
    '13': 'f',
    // exercise neutral
    '14': 'n',
    // joker
    '15': 'j',
    // faker
    '16': 'k',
};

export const SYMBOL_SET_DIM_MAP: Record<string, string> = {
    // Air
    '01': 'A',
    // Air Missile
    '02': 'A',
    // Space
    '05': 'P',
    // Space Missile
    '06': 'P',
    // Land Unit
    '10': 'G',
    // Land Civilian Unit/Organization
    '11': 'G',
    // Land Equipment
    '15': 'G',
    // Land Installation
    '20': 'G',
    // Dismounted Individual
    '27': 'G',
    // Sea Surface
    '30': 'S',
    // Sea Subsurface
    '35': 'U',
    // Mine Warfare
    '36': 'U',
    // Signals Intelligence - Space
    '50': 'P',
    // Signals Intelligence - Air
    '51': 'A',
    // Signals Intelligence - Land
    '52': 'G',
    // Signals Intelligence - Surface
    '53': 'S',
    // Signals Intelligence - Subsurface
    '54': 'U',
};

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
        return /^a-[PUAFNSHJKOXpuafnshjkox]-[PAGSUFXZ](-\w+)*$/.test(cotType);
    }

    static domain(cotType: string): Domain {
        const unknownDomain = cotType.split('-')[0];

        const d = enumFromStringValue<Domain>(Domain, unknownDomain);
        if (d === undefined) throw new Error('Domain could not be determined');

        return d;
    }

    static standardIdentity(cotType: string): StandardIdentity {
        if (!cotType.startsWith('a-')) return StandardIdentity.NONE;
        if (cotType.split('-').length < 2) return StandardIdentity.NONE;

        const unknownIdentity = cotType.split('-')[1];

        const si = enumFromStringValue(StandardIdentity, unknownIdentity);

        return si ?? StandardIdentity.NONE;
    }

    /**
     * Given a COT Atom Type, return an SIDC in 2525D format
     *
     * @param cotType - Cursor On Target Type (Note must start with atomic "a")
     */
    static to2525D(cotType: string): string {
        const str_sidc = this.to2525B(cotType);

        // Handle Short Codes Manually
        if (/^S[A-Z]{3}-{11}/.test(str_sidc)) {
            const AFF = str_sidc[1].toUpperCase()
            const DIM = str_sidc[2].toUpperCase()
            const STS = str_sidc[3].toUpperCase()

            return VERSION_2525D + SID_MAP[AFF] + DIM_MAP[DIM] + STATUS_MAP[STS] + '0000000000000';
        }

        const convert = convertLetterSidc2NumberSidc(str_sidc);

        if (!convert.sidc) {
            throw new Error(`Could not convert 2525B SIDC to 2525D`);
        }

        return convert.sidc;
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

        const m2525bChars = cotType.slice(4).replaceAll(/[^A-Z0-9]+/g, "");
        const m2525bBattleDim = m2525bChars[0];

        const cotAffiliation = cotType[2];
        const m2525bAffiliation = (cotAffiliation === "o" || cotAffiliation === "x")
            ? "U"
            : cotAffiliation.toUpperCase();

        const m2525bFuncId = m2525bChars.length > 1
            ? m2525bChars.slice(1).padEnd(6, "-").slice(0, 6)
            : "------";

        return `S${m2525bAffiliation}${m2525bBattleDim}P${m2525bFuncId}-----`;
    }

    /**
     * Check a given numeric SIDC (2525D/2525E) to see if it is compatible with conversion to CoT Type
     *
     * @param sidc - Numeric SIDC to test
     */
    static isNumericSIDCConvertable(sidc: string): boolean {
        return /^1[0-3]\d{18}$/.test(sidc);
    }

    /**
     * Given a numeric SIDC (2525D/2525E), return a basic CoT Atom Type
     * in the form a-<affiliation>-<battle dimension>
     *
     * @param sidc - Numeric SIDC to convert
     */
    static fromNumericSIDC(sidc: string): string {
        if (!this.isNumericSIDCConvertable(sidc)) {
            throw new Error("Numeric SIDC to CoT can only be applied to well-formed 2525D/2525E SIDCs.");
        }

        const affiliation = SID_REVERSE_MAP[sidc.slice(2, 4)] || 'u';
        const dimension = SYMBOL_SET_DIM_MAP[sidc.slice(4, 6)] || 'G';

        return `a-${affiliation}-${dimension}`;
    }

    /**
     * Given a numeric SIDC (2525D/2525E), return the most specific CoT Atom Type
     * that can be derived from it, falling back to the basic
     * `a-<affiliation>-<battle dimension>` type from {@link fromNumericSIDC}
     * when the symbol has no warfighting (2525B) equivalent
     *
     * Clients that can't resolve the SIDC itself - either because they predate
     * the given 2525 variant or because the detail carrying it was dropped -
     * derive their icon from the CoT Type, so retaining the Function ID is what
     * keeps a meaningful fallback icon on those clients
     *
     * @param sidc - Numeric SIDC to convert
     */
    static cotTypeFromNumericSIDC(sidc: string): string {
        const basic = this.fromNumericSIDC(sidc);

        try {
            const convert = convertNumberSidc2LetterSidc(sidc);

            if (convert.success && this.isTypeConvertable(convert.sidc)) {
                const type = this.from2525B(convert.sidc);

                // Only prefer the converted Type when it agrees with the basic Type on
                // affiliation & battle dimension - the 2525B tables can't express every
                // numeric identity (exercise & simulation identities in particular all
                // collapse to Friend when converted back)
                if (type.startsWith(`${basic}-`)) return type;
            }
        } catch {
            // No 2525B equivalent - fall back to the basic Type
        }

        return basic;
    }

    /**
     * Check a given SIDC to see if it is compatible with conversion to CoT Type
     *
     * @param sidc - SIDC to test
     */
    static isTypeConvertable(sidc: string): boolean {
        return /^S[PUAFNSHGWMDLJK-][PAGSUFXZ-][AP-][A-Z0-9-]{10}[AECGNS-]$/.test(sidc)
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

        const m2525bAffiliation = sidc[1];
        const cotAffiliation = ["G", "W", "M", "D", "L"].includes(m2525bAffiliation)
            ? "f"
            : m2525bAffiliation === "-"
                ? "o"
                : m2525bAffiliation.toLowerCase();

        const cotBattleDim = sidc[2];
        const cotFuncId = Array.from(sidc.slice(4, 10).replaceAll(/[^A-Z0-9]+/g, ""))
            .map((x) => `-${x}`)
            .join("");

        return `a-${cotAffiliation}-${cotBattleDim}${cotFuncId}`;
    }
}

function enumFromStringValue<T extends string> (enm: Record<string, T>, value: string): T | undefined {
    return Object.values(enm).find((v) => v === value);
}
