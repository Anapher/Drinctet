import { RandomTextFragment } from "@core/fragments/random-text-fragment";
import { PlayerInfo } from "@core/player-info";
import { SipsFragment } from "@core/fragments/sips-fragment";
import { PlayerReferenceFragment } from "@core/fragments/player-reference-fragment";
import { DefaultTextDecoder } from "@core/parsing/text-decoder/default-text-decoder";
import { TextFragment } from "@core/text-fragment";
import { PlayerSetting } from "@core/cards/player-setting";
import _ from "lodash";
import { RawTextFragment } from "@core/fragments/raw-text-fragment";
import { GenderBasedSelectionFragment } from "@core/fragments/gender-based-selection-fragment";
import { SelectionAlgorithm } from "@core/selection/selection-algorithm";
import {
    RandomNumberFragment,
    NumberRange,
    StaticNumber,
} from "@core/fragments/random-number-fragment";

export class TextFormatter {
    public parseTextFragments(s: string): TextFragment[] {
        return new DefaultTextDecoder().decode(s);
    }

    public static getRequiredPlayers(fragments: TextFragment[], playerSettings: PlayerSetting[]) {
        const requiredPlayers = new Array<PlayerSetting>();

        const players = _.groupBy(
            fragments
                .filter(x => x instanceof PlayerReferenceFragment)
                .map(x => x as PlayerReferenceFragment),
            "playerIndex",
        );

        for (const key in players) {
            if (players.hasOwnProperty(key)) {
                const player = players[key][0];

                let requiredGender = player.gender;

                if (requiredGender === "None") {
                    const rootSetting = playerSettings.find(
                        x => x.playerIndex === player.playerIndex,
                    );
                    if (rootSetting !== undefined) {
                        requiredGender = rootSetting.gender;
                    }
                }

                requiredPlayers.push({ playerIndex: player.playerIndex, gender: requiredGender });
            }
        }

        return requiredPlayers;
    }

    public static getRequiredSips(fragments: TextFragment[]): SipsFragment[] {
        const sips = _.groupBy(
            fragments.filter(x => x instanceof SipsFragment).map(x => x as SipsFragment),
            "sipsIndex",
        );
        return Object.values(sips).map(x => x[0]);
    }

    public format(
        fragments: TextFragment[],
        players: { [index: number]: PlayerInfo },
        sips: { [index: number]: number },
        translate: (key: string) => string,
        selection: SelectionAlgorithm,
        options: Partial<FormatOptions>,
    ): string {
        let result = "";
        let lastPlayerFragment: PlayerReferenceFragment | null = null;

        for (const fragment of fragments) {
            if (fragment instanceof RawTextFragment) {
                result += fragment.text;
            } else if (fragment instanceof PlayerReferenceFragment) {
                if (options.boldPlayerNames) {
                    result += "**";
                }
                result += players[fragment.playerIndex].name;
                if (options.boldPlayerNames) {
                    result += "**";
                }

                lastPlayerFragment = fragment;
            } else if (fragment instanceof SipsFragment) {
                if (options.boldSips) {
                    result += "**";
                }

                const sip = sips[fragment.sipsIndex];
                if (sip === 1) {
                    translate("oneSip");
                } else {
                    result += `${sip} ${translate("sips")}`;
                }

                if (options.boldSips) {
                    result += "**";
                }
            } else if (fragment instanceof GenderBasedSelectionFragment) {
                let referencedPlayer: number;
                if (fragment.referencedPlayerIndex !== undefined) {
                    referencedPlayer = fragment.referencedPlayerIndex;
                } else if (lastPlayerFragment !== null) {
                    referencedPlayer = lastPlayerFragment.playerIndex;
                } else {
                    const playerKeys = Object.keys(players);
                    if (playerKeys.length === 0) {
                        continue;
                    }

                    referencedPlayer = Number(playerKeys[0]);
                }

                const player = players[referencedPlayer];
                result += player.gender === "Female" ? fragment.femaleText : fragment.maleText;
            } else if (fragment instanceof RandomTextFragment) {
                const text = selection.selectRandomWeighted(fragment.texts, () => 1);
                result += text;
            } else if (fragment instanceof RandomNumberFragment) {
                const number = selection.selectRandomWeighted(fragment.numbers, x => x.getCount());
                if (number === undefined) {
                    continue;
                }

                if (number instanceof NumberRange) {
                    const random =
                        number.min + Math.round((number.max - number.min) * selection.getRandom());
                    result += random;
                } else if (number instanceof StaticNumber) {
                    result += number.i;
                }
            }
        }

        return result;
    }
}

export interface FormatOptions {
    boldPlayerNames: boolean;
    boldSips: boolean;
}
