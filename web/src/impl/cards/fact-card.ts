import { TextCard } from "../../core/cards/text-card";

export class FactCard extends TextCard {
    public type: string = "Fact";
    public isTrueFact: boolean = false;
}
