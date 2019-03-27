import { ParserHelper } from "./../parser-helper";
import { CardTextDecoder } from "./card-text-decoder";
import { TextFragment } from "../../text-fragment";
import * as Consts from "./text-decoder-consts";
import { RawTextFragment } from "../../fragments/raw-text-fragment";
import { PlayerReferenceFragment } from "../../fragments/player-reference-fragment";
import { SipsFragment } from "../../fragments/sips-fragment";
import {
    RandomNumberFragment,
    RandomNumber,
    NumberRange,
    StaticNumber,
} from "../../fragments/random-number-fragment";
import { RandomTextFragment } from "../../fragments/random-text-fragment";
import { GenderBasedSelectionFragment } from "../../fragments/gender-based-selection-fragment";
import { SocialMediaPlatformFragment } from "@core/fragments/social-media-platform-fragment";

export class DefaultTextDecoder implements CardTextDecoder {
    decode(s: string): TextFragment[] {
        const result: TextFragment[] = [];

        let index = 0;
        let lastTokenIndex = 0;

        do {
            if (s[index] == Consts.VarStartChar) {
                if (lastTokenIndex !== index) {
                    result.push(new RawTextFragment(s.substring(lastTokenIndex, index)));
                }

                const token = this.readToken(s, index, Consts.VarEndChar);
                index = token.index;

                result.push(this.parseVariableFragment(token.value));
            } else if (s[index] === Consts.SelectionStartChar) {
                if (index > 1 && s[index - 1] === Consts.SelectionModifierStartChar) {
                    // handle !{...}
                    index--;
                    if (lastTokenIndex !== index) {
                        result.push(new RawTextFragment(s.substring(lastTokenIndex, index)));
                    }

                    index++;
                    const content = this.readToken(s, index, Consts.SelectionEndChar);
                    index = content.index;

                    result.push(this.parseRandomSelectionFragment(content.value));
                } else {
                    if (lastTokenIndex !== index) {
                        result.push(new RawTextFragment(s.substring(lastTokenIndex, index)));
                    }

                    const content = this.readToken(s, index, Consts.SelectionEndChar);
                    index = content.index;

                    result.push(this.parseGenderSelectionFragment(content.value));
                }
            } else {
                continue;
            }

            lastTokenIndex = index;
        } while (++index < s.length);

        if (lastTokenIndex !== s.length) {
            result.push(new RawTextFragment(s.substring(lastTokenIndex)));
        }

        return result;
    }

    public parseVariableFragment(content: string): TextFragment {
        content = content.toLowerCase();

        if (content.startsWith(Consts.PlayerVariable)) {
            // Samples:
            // [Player1:f]
            // [Player1]
            // [Player]

            const playerRef = new PlayerReferenceFragment();

            const parameterBegin = content.indexOf(Consts.VariableParametersStart);

            let playerTag: string;
            if (parameterBegin === -1) {
                playerTag = content;
            } else {
                playerTag = content.substring(0, parameterBegin);

                const genderString = content.substring(parameterBegin + 1);
                const gender = ParserHelper.parseGenderRequirement(genderString);
                if (gender === undefined) {
                    throw new Error(
                        `Gender parameter of player tag could not be parsed: ${content}`,
                    );
                }

                playerRef.gender = gender;
            }

            playerRef.playerIndex = this.parsePlayerIndex(playerTag);
            return playerRef;
        }

        if (content.startsWith(Consts.SipsVariable)) {
            const sipsFragment = new SipsFragment();
            const parameterBegin = content.indexOf(Consts.VariableParametersStart);

            let sipsTag: string;
            if (parameterBegin === -1) {
                sipsTag = content;
            } else {
                sipsTag = content.substring(0, parameterBegin);
                sipsFragment.minSips = Number(content.substring(parameterBegin + 1));
                if (isNaN(sipsFragment.minSips)) {
                    throw new Error(`The sips amount of "${sipsTag}" could not be parsed.`);
                }
            }

            if (sipsTag.length > Consts.SipsVariable.length) {
                sipsFragment.sipsIndex = Number(sipsTag.substring(Consts.SipsVariable.length));
                if (isNaN(sipsFragment.sipsIndex)) {
                    throw new Error(`The sips index of "${sipsTag}" could not be parsed.`);
                }
            }

            return sipsFragment;
        }

        if (content === Consts.SocialMediaVariable) {
            return new SocialMediaPlatformFragment();
        }

        return new RawTextFragment(content);
    }

    public parseRandomSelectionFragment(content: string): TextFragment {
        // Samples:
        // 12,54,56-90
        // 12,hello,not,19

        const isNumericSelection = /^[0-9,-]+$/.test(content);
        if (isNumericSelection) {
            const numbers = this.parseNumberArray(content);
            return new RandomNumberFragment(numbers);
        }

        const texts = this.splitQuoted(content, ",");
        return new RandomTextFragment(texts);
    }

    public parseNumberArray(content: string): RandomNumber[] {
        const result: RandomNumber[] = [];
        let currentNumber: RandomNumber | null = null;

        let numberStart = 0;
        let isRangeToken = false;

        let i = 0;
        while (true) {
            for (; i < content.length; i++) {
                const c = content[i];

                if (!isNaN(Number(c))) {
                    continue;
                }

                if (c === "-") {
                    if (isRangeToken) {
                        throw new Error("Can only have one range identifier per field");
                    }
                    isRangeToken = true;

                    currentNumber = new NumberRange(Number(content.substring(numberStart, i)), 0);
                    numberStart = i + 1;
                    continue;
                }

                if (c === ",") {
                    break;
                }

                throw new Error("Invalid character found: " + c);
            }

            if (i === numberStart) {
                throw new Error(`A number was expected at position ${i} in string "${content}"`);
            }

            const num = Number(content.substring(numberStart, i));
            if (isRangeToken) {
                (currentNumber as NumberRange).max = num;
            } else {
                currentNumber = new StaticNumber(num);
            }

            result.push(currentNumber!);

            if (i === content.length) {
                break;
            }

            currentNumber = null;
            isRangeToken = false;
            numberStart = ++i;
        }

        return result;
    }

    public splitQuoted(value: string, delimiter: string): string[] {
        let tokenStart = 0;
        let result: string[] = [];

        while (value.length > tokenStart - 1) {
            let withinQuotes = false;

            if (value[tokenStart] === '"') {
                withinQuotes = true;
                tokenStart++;
            }

            let i = tokenStart;
            do {
                if (value[i] === delimiter) {
                    if (withinQuotes) continue;

                    result.push(value.substring(tokenStart, i));
                    tokenStart = i + 1;
                    break;
                }

                if (value[i] == '"') {
                    if (!withinQuotes) {
                        continue; //allow quotes in the middle
                    }

                    if (i == value.length - 1) {
                        //if its the last char
                        result.push(value.substring(tokenStart, i).replace('""', '"'));
                        return result;
                    }

                    const nextChar = value[i + 1];
                    if (nextChar == '"') {
                        i++;
                        continue; //escaped quotes
                    }

                    if (nextChar != delimiter)
                        throw new Error("The delimiter must come after the closing quotes.");

                    result.push(value.substring(tokenStart, i).replace('""', '"'));
                    tokenStart = i + 2;
                    break;
                }

                if (i == value.length - 1) {
                    if (withinQuotes) {
                        throw new Error("The text must end with a quote");
                    }

                    result.push(value.substring(tokenStart, i + 1));
                    return result;
                }
            } while (++i < value.length);
        }

        return result;
    }

    public parseGenderSelectionFragment(content: string): GenderBasedSelectionFragment {
        const fragment = new GenderBasedSelectionFragment("");

        const splitterIndex = content.indexOf(Consts.SelectionSplitterChar);
        const reference = content.indexOf(Consts.SelectionReferenceChar);

        if (reference !== -1) {
            fragment.referencedPlayerIndex = this.parsePlayerIndex(
                content.substring(reference + 1),
            );
            content = content.substring(0, reference);
        }

        if (splitterIndex === -1) {
            fragment.femaleText = content;
        } else {
            fragment.maleText = content.substring(0, splitterIndex);
            fragment.femaleText = content.substring(splitterIndex + 1, content.length);
        }

        return fragment;
    }

    public parsePlayerIndex(value: string): number {
        if (value.length > Consts.PlayerVariable.length) {
            const index = Number(value.substring(Consts.PlayerVariable.length));
            if (isNaN(index)) {
                throw new Error(`The player index of "${value}" could not be parsed.`);
            }

            return index;
        }

        return 1;
    }

    public readToken(
        value: string,
        index: number,
        endChar: string,
    ): { value: string; index: number } {
        const length = value.length;
        const tokenStart = index;

        while (++index < length) {
            const char = value[index];

            if (char === Consts.EscapeChar) {
                index++;
                continue;
            }

            if (char === endChar) {
                index++;
                break;
            }
        }

        return { index, value: value.substring(tokenStart + 1, index - 1) };
    }
}
