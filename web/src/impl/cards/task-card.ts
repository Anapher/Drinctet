import { TextCard } from "@core/cards/text-card";
import { GenderRequirement } from "@core/cards/player-setting";

export class TaskCard extends TextCard {
    public readonly type: string = "TaskCard";
    public genderRequirement: GenderRequirement = "None";
}
