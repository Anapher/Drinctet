import { TextFormatter } from "./text-formatter";
import { TextFragment } from "@core/text-fragment";

export class CachedTextFormatter extends TextFormatter {
    private parseTextFragmentsParam: string = "";
    private parseTextFragmentsResult: TextFragment[] = [];

    public parseTextFragments(s: string): TextFragment[] {
        if (s === this.parseTextFragmentsParam) {
            return this.parseTextFragmentsResult;
        }

        const result = super.parseTextFragments(s);
        this.parseTextFragmentsResult = result;
        this.parseTextFragmentsParam = s;

        return result;
    }
}
