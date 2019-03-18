import { BaseCard } from "../cards/base-card";
import { Card } from "../cards/card";
import { GenderRequirement, PlayerSetting } from "../cards/player-setting";
import { CardParser } from "./card-parser";
import { ParserHelper } from "./parser-helper";

export abstract class BaseCardParser<TCard extends BaseCard> implements CardParser {
    public deserialize(xml: Element): Card {
        const card = this.createCard();

        const idAttr = xml.getAttribute("id");
        if (idAttr === null) {
            throw new Error("The id of a card must not be null");
        }
        card.id = idAttr;

        card.willPower = Number(xml.getAttribute("willPower"));
        if (card.willPower < 1 || card.willPower > 10) {
            card.willPower = undefined;
        }

        const tags = xml.getAttribute("tags");

        card.tags = tags
            ? [...this.getDefaultAttributes(), ...tags.split(",")]
            : this.getDefaultAttributes();

        this.parseAttributes(xml, card);

        const subElements = xml.getElementsByTagName("*");
        for (let i = 0; i < subElements.length; i++) {
            const element = subElements[i];

            if (element.parentElement !== xml) {
                continue;
            }

            if (element.tagName === `${xml.tagName}.players`) {
                card.players = this.parsePlayers(element);
                continue;
            }

            this.parseElement(element, card);
        }

        if (card.players === undefined) {
            card.players = [];
        }

        return card;
    }

    protected getDefaultAttributes(): string[] {
        return [];
    }

    protected abstract parseAttributes(rootXml: Element, card: TCard): void;
    protected abstract parseElement(element: Element, card: TCard): boolean;

    protected abstract createCard(): TCard;

    private parsePlayers(xml: Element): PlayerSetting[] {
        const players: PlayerSetting[] = [];

        const subElements = xml.getElementsByTagName("*");
        for (let i = 0; i < subElements.length; i++) {
            const element = subElements[i];

            if (element.parentElement !== xml) {
                continue;
            }

            const player = this.parsePlayer(element);
            if (player !== undefined) {
                players.push(player);
            }
        }

        return players;
    }

    private parsePlayer(xml: Element): PlayerSetting | undefined {
        const index = ParserHelper.parsePlayerTag(xml.tagName);
        if (index === undefined) {
            return undefined;
        }

        let requiredGender: GenderRequirement = "None";

        const genderAttr = xml.getAttribute("gender");
        if (genderAttr) {
            const genderReq = ParserHelper.parseGenderRequirement(genderAttr);

            if (genderReq !== undefined) {
                requiredGender = genderReq;
            }
        }

        return new PlayerSetting(index, requiredGender);
    }
}
