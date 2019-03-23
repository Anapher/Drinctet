import { CardDeck } from "@core/card-deck";
import { Card } from "@core/cards/card";
import { PlayerSetting } from "@core/cards/player-setting";
import { GameStatus } from "@core/game-status";
import { MelinaAlgorithm } from "@core/selection/melina-algorithm";
import { SelectionAlgorithm } from "@core/selection/selection-algorithm";
import { RootState } from "DrinctetTypes";
import { SelectedPlayer } from "GameModels";
import seedrandom from "seedrandom";
import store from "../../store";

export function selectPlayers(
    selection: SelectionAlgorithm,
    players: PlayerSetting[],
    predefined: SelectedPlayer[],
    card: Card,
): SelectedPlayer[] {
    const result = selection.selectPlayers(
        players.map(x => x.gender),
        players.map(x => {
            const p = predefined.find(y => y.index === x.playerIndex);
            if (p === undefined) {
                return null;
            }

            return p.player;
        }),
        card,
    );
    const selected = result.map((x, i) => ({ index: players[i].playerIndex, player: x }));

    return selected;
}

export function getRandomSelectionAlgorithm(state?: RootState): SelectionAlgorithm {
    if (state === undefined) {
        state = store.getState();
    }

    const random = seedrandom();
    return new MelinaAlgorithm(extractGameStatus(state), random);
}

function extractGameStatus(state: RootState): GameStatus {
    const currentStatus: GameStatus = {
        decks: state.settings.sources
            .filter(x => x.cards !== undefined)
            .map(item => {
                const result: CardDeck = { ...item, cards: item.cards || [] };
                return result;
            }),
        cardsHistory: state.game.cardsHistory,
        language: state.localize.languages.find(x => x.active)!.code,
        players: state.settings.players,
        slides: state.settings.slides,
        tags: state.settings.tags,
        arrangements: state.settings.arrangements,
        preferOppositeGenders: state.settings.preferOppositeGenders,
        slidesHistory: state.game.slidesHistory,
        startTime: state.game.startTime!,
        willPower: state.game.currentWillPower,
    };

    return currentStatus;
}
