import { VariableFragment } from "./variable-fragment";

export class SipsFragment extends VariableFragment {
    constructor(public minSips: number = 1, public sipsIndex: number = 1) {
        super();
    }
}
