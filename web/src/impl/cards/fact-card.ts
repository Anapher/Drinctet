import { TextCard } from "../../core/cards/text-card";

export class FactCard extends TextCard {
    public readonly type: string = "FactCard";
    public isTrueFact: boolean = false;
}
