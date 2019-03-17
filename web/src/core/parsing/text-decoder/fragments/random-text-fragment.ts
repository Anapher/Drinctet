import { TextFragment } from "../text-fragment";

export class RandomTextFragment extends TextFragment {
    constructor(public texts: string[]) {
        super();
    }
}
