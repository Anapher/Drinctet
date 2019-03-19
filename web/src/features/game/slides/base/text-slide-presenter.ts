import { TextCard } from "@core/cards/text-card";
import { CardPresenter } from "./card-presenter";
import * as gameEngine from "../../game-engine";
import { ReactNode } from "react";
import store from "../../../../store/index";
import * as actions from "../../actions";
import { SelectionAlgorithm } from "@core/selection/selection-algorithm";
import { TextFormatter } from "../../formatter/text-formatter";
import { PlayerInfo } from "@core/player-info";
import { FollowUpSlide, SelectedPlayer } from "GameModels";
import _ from "underscore";

export interface TextSlideState {
    markdownContent: string;
}

export type TranslateFunc = (key: string) => string;

export abstract class TextSlidePresenter<
    TState extends TextSlideState,
    TCard extends TextCard
> extends CardPresenter<TCard> {
    private readonly formatter = new TextFormatter();

    constructor(protected translate: TranslateFunc, cardType: string) {
        super(cardType);
    }

    protected initializeCard(card: TCard): ReactNode {
        const selection = gameEngine.getRandomSelectionAlgorithm();

        const text = this.selectText(selection, card);
        const { formatted, players } = this.formatText(text, card, null, selection);

        const state = this.initializeState(formatted, card, players, selection);
        store.dispatch(actions.setSlideState(state));

        if (_.any(card.followUp)) {
            // dont check for correct translation as the language may change
            if (Math.random() <= card.followUpPropability) {
                const due = new Date();
                due.setSeconds(due.getSeconds() + card.followUpDelay);

                store.dispatch(actions.enqueueFollowUp(this.createFollowUp(card, players, due)));
            }
        }

        return this.initializeSlide(state);
    }

    protected initializeFollowUpCard(card: TCard, param: any): ReactNode {
        const selection = gameEngine.getRandomSelectionAlgorithm();

        const { text, players } = this.selectFollowUpText(selection, card, param);
        const { formatted } = this.formatText(text, card, players || [], selection);

        const state = this.initializeFollowUpState(formatted, card, selection, param);
        store.dispatch(actions.setSlideState(state));

        return this.initializeSlide(state);
    }

    protected abstract initializeSlide(state: TState): ReactNode;

    protected abstract initializeState(
        markdownContent: string,
        card: TCard,
        players: SelectedPlayer[],
        selection: SelectionAlgorithm,
    ): TState;

    protected abstract initializeFollowUpState(
        markdownContent: string,
        card: TCard,
        selection: SelectionAlgorithm,
        param: any,
    ): TState;

    protected createFollowUp(card: TCard, players: SelectedPlayer[], due: Date): FollowUpSlide {
        const slideType = store.getState().game.selectedSlide;
        return {
            due: due,
            slideType: slideType!,
            selectedCard: card,
            param: { definedPlayers: players },
        };
    }

    protected formatText(
        text: string,
        card: TCard,
        definedPlayers: SelectedPlayer[] | null,
        selection: SelectionAlgorithm,
    ): { formatted: string; players: SelectedPlayer[] } {
        const fragments = this.formatter.parseTextFragments(text);
        const playerRequirements = TextFormatter.getRequiredPlayers(fragments, card.players);

        const players = gameEngine.selectPlayers(playerRequirements, definedPlayers || [], card);

        const requiredSips = TextFormatter.getRequiredSips(fragments);

        const indexedPlayers: { [index: number]: PlayerInfo } = {};
        for (const player of players) {
            indexedPlayers[player.index] = player.player;
        }

        const sips: { [index: number]: number } = {};
        for (const sipInfo of requiredSips) {
            sips[sipInfo.sipsIndex] = selection.getSips(sipInfo.minSips);
        }

        const formatted = this.formatter.format(
            fragments,
            indexedPlayers,
            sips,
            x => this.translate(`game.textFormatter.${x}`),
            selection,
            { boldPlayerNames: true, boldSips: true },
        );

        return { formatted: formatted, players };
    }

    selectText(selection: SelectionAlgorithm, selectedCard: TextCard): string {
        const lang = store.getState().localize.languages.find(x => x.active)!.code;

        const viableContents = selectedCard.content.filter(x =>
            _.any(x.translations, y => y.lang.toLocaleLowerCase() === lang),
        );
        const content = selection.selectRandomWeighted(viableContents, x => x.weight)!;
        return content.translations.find(x => x.lang === lang)!.content;
    }

    selectFollowUpText(
        selection: SelectionAlgorithm,
        selectedCard: TextCard,
        param: any,
    ): { text: string; players?: SelectedPlayer[] } {
        const lang = store.getState().localize.languages.find(x => x.active)!.code;

        const followUps = selectedCard.followUp.filter(x =>
            _.any(x.translations, y => y.lang.toLowerCase() === lang),
        );
        if (followUps.length === 0) {
            store.dispatch(actions.requestSlideAsync.request());
            return { text: "" };
        }

        let players: SelectedPlayer[] | undefined;
        if ("definedPlayers" in param) {
            players = param.definedPlayers;
        } else {
            players = undefined;
        }

        const content = selection.selectRandomWeighted(followUps, x => x.weight)!;
        const text = content.translations.find(x => x.lang === lang)!.content;
        return { text, players };
    }
}
