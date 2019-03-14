import axios from "axios";
import { CardsLoader } from "../../core/cards-loader";
import { Card } from "../../core/cards/card";
import { DefaultCardParserFactory } from "../../impl/default-card-parser-factory";

const parserFactory = new DefaultCardParserFactory();
const loader = new CardsLoader(requestFile, parserFactory);

async function requestFile(url: string) : Promise<string> {
    const response = await axios.get(url);
    return response.data;
}

export async function loadCards(url: string): Promise<Card[]> {
    return loader.loadFromUrl(url);
}
