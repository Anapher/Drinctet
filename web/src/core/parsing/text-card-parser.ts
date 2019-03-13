import { TextCard } from "../cards/text-card";
import { BaseCardParser } from "./base-card-parser";
import { ParserHelper } from "./parser-helper";

export abstract class TextCardParser<TCard extends TextCard> extends BaseCardParser<TCard> {
    protected parseAttributes(rootXml: Element, card: TCard): void {
        const followUpProbability = Number(rootXml.getAttribute("followUpProbability"));
        if (!isNaN(followUpProbability))
            card.followUpPropability = followUpProbability;
        
        const followUpDelay = rootXml.getAttribute("followUpDelay");
        if (followUpDelay)
            card.followUpDelay = ParserHelper.parseTimeSpanStringToSeconds(followUpDelay);
    }

    protected abstract parseElement(element: Element, card: TCard): void {

    }
}
