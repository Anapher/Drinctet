import { TextCardParser } from "../../core/parsing/text-card-parser";
import { FactCard } from "../cards/fact-card";

export class FactCardParser extends TextCardParser<FactCard> {
    protected createCard(): FactCard {
        return new FactCard();
    }

    protected parseAttributes(rootXml: Element, card: FactCard): void {
        super.parseAttributes(rootXml, card);

        const attr = rootXml.getAttribute("is");
        card.isTrueFact = attr === null ? true : this.toBool(attr);
    }

    protected toBool(value?: string): boolean {
        if (value === "true") {
            return true;
        }

        if (value === undefined) {
            return false;
        }

        return !!+value;
    }
}
