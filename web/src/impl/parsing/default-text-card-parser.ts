import { TextCardParser } from "@core/parsing/text-card-parser";
import { TextCard } from "@core/cards/text-card";

export class DefaultTextCardParser<T extends TextCard> extends TextCardParser<T> {
    constructor(private factory: new () => T) {
        super();
    }

    protected createCard(): T {
        return new this.factory();
    }
}
