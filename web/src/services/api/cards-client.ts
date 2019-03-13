import axios from "axios";

export async function loadCards(url: string) : Promise<string> {
    const result = await axios.get(url);
    return result.data;
}