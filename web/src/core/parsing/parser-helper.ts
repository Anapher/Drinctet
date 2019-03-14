import { GenderRequirement } from "../cards/player-setting";

export class ParserHelper {
    /** parse a player tag, e. g. "Player" or "Player2" or "Player5000" and return the index (1 if none is specified) or undefined */
    public static parsePlayerTag(s: string): number | undefined {
        const tagName = "Player";

        if (!s.startsWith(tagName)) {
            return undefined;
        }

        if (s.length > tagName.length) {
            const index = Number(s.substring(tagName.length));
            return isNaN(index) ? undefined : index;
        }

        return 1;
    }

    /** parse a gender requirement string, e. g. "m", "male", "Male", etc. */
    public static parseGenderRequirement(s: string): GenderRequirement |undefined {
        s = s.toLowerCase();

        if (s in this.genderRequirementMap) {
            return this.genderRequirementMap[s];
        }

        return undefined;
    }

    /** parse a timespan in the format hh:mm:ss or mm:ss */
    public static parseTimeSpanStringToSeconds(s: string): number | undefined {
        const a = s.split(":");

        if (a.length > 3) {
            return undefined;
        }

        let result = 0;

        for (let i = 0; i < a.length; i++) {
            const p = Number(a[i]);
            if (isNaN(p)) {
                return undefined;
            }

            result += p * Math.pow(60, (a.length - i - 1));
        }

        return result;
    }

    private static genderRequirementMap: { [id: string]: GenderRequirement } = {
        m: "Male",
        male: "Male",
        f: "Female",
        female: "Female",
        o: "Opposite",
        opposite: "Opposite",
        s: "Same",
        same: "Same",
    };
}
