import { TextFragment } from "../../text-fragment";

export interface CardTextDecoder {
    decode(s: string): TextFragment[];
}