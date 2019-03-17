import { VariableFragment } from "./variable-fragment";
import { GenderRequirement } from "../../../cards/player-setting";

export class PlayerReferenceFragment extends VariableFragment {
    constructor(public playerIndex: number = 1, public gender: GenderRequirement = "None") {
        super();
    }
}
