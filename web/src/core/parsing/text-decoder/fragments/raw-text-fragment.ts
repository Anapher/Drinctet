import { TextFragment } from "../text-fragment";

export class RawTextFragment extends TextFragment {
    constructor(public text: string) {
        super();
    }
}