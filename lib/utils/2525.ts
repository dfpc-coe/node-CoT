/**
 * @class
 *
 * Convert a COT Atom Type to/from Symbol Identification Code (SIDC)
 * Migrated to TypeScript from the original Kotlin verison
 * @ https://github.com/cyberpython/kotcot under the MIT License
 */
export default class Type2525 {

    /**
     * Given a COT Atom Type, return an SIDC
     * @param cotType - Cursor On Target Type (Note must start with atomic "a")
     */
    static to2525B(cotType: string): string {
        if (!cotType.match(/^a-[puafnshjkox]-[PAGSUFXZ](-\w+)*$/)) {
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

    static from2525B(sidc : string) : string {
        if (!/^S[PUAFNSHGWMDLJK\-][PAGSUFXZ\-][AP\-][A-Z0-9\-]{10}[AECGNS\-]$/.test(sidc)) {
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
