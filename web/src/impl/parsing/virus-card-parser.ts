import { TextCardParser } from "@core/parsing/text-card-parser";
import { VirusCard } from '../cards/virus-card';

export class VirusCardParser extends TextCardParser<VirusCard> {
    protected createCard(): VirusCard {
        return new VirusCard();
    }

    protected parseAttributes(rootXml: Element, card: VirusCard): void {
        super.parseAttributes(rootXml, card);

        const followUpDelay = rootXml.getAttribute("followUpDelay");
        if (followUpDelay === null) {
            card.followUpDelay = 60 * 5; // 5 minutes default
        }
    }
}
