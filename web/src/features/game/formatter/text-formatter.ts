import { SipsFragment } from './../../../core/fragments/sips-fragment';
import { PlayerReferenceFragment } from "@core/fragments/player-reference-fragment";
import { DefaultTextDecoder } from "@core/parsing/text-decoder/default-text-decoder";
import { TextFragment } from "@core/text-fragment";
import { PlayerSetting } from "@core/cards/player-setting";
import _ from "underscore";

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
        const sips = _.groupBy(fragments.filter(x => x instanceof SipsFragment).map(x => x as SipsFragment), "sipsIndex");
        return Object.values(sips).map(x => x[0]);
    }
}
