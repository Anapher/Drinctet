import { RandomTextFragment } from './../../../core/fragments/random-text-fragment';
import { PlayerInfo } from "@core/player-info";
import { SipsFragment } from "@core/fragments/sips-fragment";
import { PlayerReferenceFragment } from "@core/fragments/player-reference-fragment";
import { DefaultTextDecoder } from "@core/parsing/text-decoder/default-text-decoder";
import { TextFragment } from "@core/text-fragment";
import { PlayerSetting } from "@core/cards/player-setting";
import _ from "underscore";
import { RawTextFragment } from "@core/fragments/raw-text-fragment";
import { GenderBasedSelectionFragment } from "@core/fragments/gender-based-selection-fragment";

export class TextFormatter {
    public parseTextFragments(s: string): TextFragment[] {
        return new DefaultTextDecoder().decode(s);
    }

    public getRequiredPlayers(fragments: TextFragment[], playerSettings: PlayerSetting[]) {
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

    public getRequiredSips(fragments: TextFragment[]): SipsFragment[] {
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
        options: Partial<FormatOptions>,
    ): string {
        let result = "";
        let lastPlayerFragment: PlayerReferenceFragment | null = null;

        for (const fragment of fragments) {
            if (fragment instanceof RawTextFragment) {
                result += fragment.text;
            } else if (fragment instanceof PlayerReferenceFragment) {
                if (options.boldPlayerNames) {
                    result += "*";
                }
                result += players[fragment.playerIndex].name;
                if (options.boldPlayerNames) {
                    result += "*";
                }

                lastPlayerFragment = fragment;
            } else if (fragment instanceof SipsFragment) {
                if (options.boldSips) {
                    result += "*";
                }

                const sip = sips[fragment.sipsIndex];
                if (sip === 1) {
                    translate("oneSip");
                } else {
                    result += `${sip} ${translate("sips")}`;
                }

                if (options.boldSips) {
                    result += "*";
                }
            } else if (fragment instanceof GenderBasedSelectionFragment) {
                let referencedPlayer: number;
                if (fragment.referencedPlayerIndex !== undefined) {
                    referencedPlayer = fragment.referencedPlayerIndex;
                } else if(lastPlayerFragment !== null) {
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
                const index = 
            }
        }

        return result;
    }
}

export interface FormatOptions {
    boldPlayerNames: boolean;
    boldSips: boolean;
}
