import { TextCard } from "../cards/text-card";
import { BaseCardParser } from "./base-card-parser";
import { ParserHelper } from "./parser-helper";
import { TextContentParser } from "./text-content-parser";

export abstract class TextCardParser<TCard extends TextCard> extends BaseCardParser<TCard> {
    private textContentParser = new TextContentParser();

    protected parseAttributes(rootXml: Element, card: TCard): void {
        const followUpAttr = rootXml.getAttribute("followUpProbability");
        if (followUpAttr !== null) {
            const followUpProbability = Number(followUpAttr);
            if (isNaN(followUpProbability)) {
                throw new Error(
                    `The follow up propability ${followUpAttr} could not be parsed as a number (card: ${
                        card.id
                    }).`,
                );
            }

            card.followUpPropability = followUpProbability;
        }

        const followUpDelay = rootXml.getAttribute("followUpDelay");
        if (followUpDelay !== null) {
            const seconds = ParserHelper.parseTimeSpanStringToSeconds(followUpDelay);
            if (seconds === undefined) {
                throw new Error(
                    `Could not parse followUpDelay ${followUpDelay} as a timespan (card: ${
                        card.id
                    }).`,
                );
            }

            card.followUpDelay = seconds;
        }
    }

    protected parseElement(element: Element, card: TCard): boolean {
        switch (element.tagName) {
            case "Text":
            case "Case":
                card.content = this.textContentParser.result;
                return this.textContentParser.addElement(element);
        }

        if (element.tagName === `${card.type}.followUp`) {
            const parser = new TextContentParser();

            const subElements = element.getElementsByTagName("*");
            for (let i = 0; i < subElements.length; i++) {
                const subElement = subElements[i];
                if (subElement.parentElement !== element) {
                    continue;
                }

                parser.addElement(subElement);
            }

            card.followUp = parser.result;
            return true;
        }

        return false;
    }
}
