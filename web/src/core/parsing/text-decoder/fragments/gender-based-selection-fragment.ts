import { TextFragment } from "../text-fragment";

export class GenderBasedSelectionFragment extends TextFragment {
    constructor(
        public femaleText: string,
        public maleText?: string,
        public referencedPlayerIndex?: number,
    ) {
        super();
    }
}
