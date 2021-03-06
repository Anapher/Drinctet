import { CardRef } from "@core/cards/card-ref";
import { TextCard } from "@core/cards/text-card";
import { DefaultTextDecoder } from "@core/parsing/text-decoder/default-text-decoder";
import { PlayerInfo } from "@core/player-info";
import { MelinaAlgorithm } from "@core/selection/melina-algorithm";
import { SelectionAlgorithm } from "@core/selection/selection-algorithm";
import { RootAction } from "DrinctetTypes";
import { FollowUpSlide, SelectedPlayer, Translator } from "GameModels";
import _ from "lodash";
import store from "../../../../store";
import * as actions from "../../actions";
import { TextFormatter } from "../../formatter/text-formatter";
import * as gameEngine from "../../game-engine";
import { CardPresenter } from "./card-presenter";

export interface TextSlideState {
    markdownContent: string;
}

export abstract class TextSlidePresenter<
    TState extends TextSlideState,
    TCard extends TextCard
> extends CardPresenter<TCard> {
    constructor(protected translator: Translator, cardType: string, slideType: string) {
        super(cardType, slideType);
    }

    protected initializeCard(card: TCard, cardRef: CardRef): RootAction[] {
        const selection = gameEngine.getRandomSelectionAlgorithm();
        const result = new Array<RootAction>();

        const text = this.selectText(selection, card);
        let formatted: string;
        let players: SelectedPlayer[];

        try {
            const result = this.formatText(text, card, null, selection);
            formatted = result.formatted;
            players = result.players;
        } catch (error) {
            // likely not enough players
            return [actions.requestSlideAsync.request(this.translator)];
        }

        const state = this.initializeState(formatted, card, players, selection);
        result.push(
            actions.setSlideState({
                state,
                insights: (selection as MelinaAlgorithm).insights.playerSelection,
            }),
        );

        if (_.some(card.followUp)) {
            // dont check for correct translation as the language may change
            if (Math.random() <= card.followUpPropability) {
                const due = new Date();
                due.setSeconds(due.getSeconds() + card.followUpDelay);

                result.push(actions.enqueueFollowUp(this.createFollowUp(cardRef, players, due)));
            }
        }

        return result;
    }

    protected initializeFollowUpCard(card: TCard, param: any): RootAction[] {
        const selection = gameEngine.getRandomSelectionAlgorithm();

        try {
            const { text, players } = this.selectFollowUpText(selection, card, param);
            const { formatted } = this.formatText(text, card, players || [], selection);

            const state = this.initializeFollowUpState(formatted, card, selection, param);
            return [
                actions.setSlideState({
                    state,
                    insights: (selection as MelinaAlgorithm).insights.playerSelection,
                }),
            ];
        } catch (error) {
            //no follow up found
            return [actions.requestSlideAsync.request(this.translator)];
        }
    }

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

    protected createFollowUp(
        cardRef: CardRef,
        players: SelectedPlayer[],
        due: Date,
    ): FollowUpSlide {
        return {
            due: due,
            slideType: this.slideType,
            selectedCard: cardRef,
            param: { definedPlayers: players },
        };
    }

    protected selectText(selection: SelectionAlgorithm, selectedCard: TextCard): string {
        return selectText(selection, selectedCard, this.translator);
    }

    protected formatText(
        text: string,
        card: TCard,
        definedPlayers: SelectedPlayer[] | null,
        selection: SelectionAlgorithm,
    ): { formatted: string; players: SelectedPlayer[] } {
        return formatText(text, card, definedPlayers, selection, this.translator);
    }

    selectFollowUpText(
        selection: SelectionAlgorithm,
        selectedCard: TextCard,
        param: any,
    ): { text: string; players?: SelectedPlayer[] } {
        const lang = this.translator.languageCode;

        const followUps = selectedCard.followUp.filter(x =>
            _.some(x.translations, y => y.lang.toLowerCase() === lang),
        );
        if (followUps.length === 0) {
            throw new Error("No follow ups found");
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

export function formatText<TCard extends TextCard>(
    text: string,
    card: TCard,
    definedPlayers: SelectedPlayer[] | null,
    selection: SelectionAlgorithm,
    translator: Translator,
): { formatted: string; players: SelectedPlayer[] } {
    const fragments = new DefaultTextDecoder().decode(text);
    const playerRequirements = TextFormatter.getRequiredPlayers(fragments, card.players);

    const players = gameEngine.selectPlayers(
        selection,
        playerRequirements,
        definedPlayers || [],
        card.tags,
    );

    const requiredSips = TextFormatter.getRequiredSips(fragments);

    const indexedPlayers: { [index: number]: PlayerInfo } = {};
    for (const player of players) {
        indexedPlayers[player.index] = player.player;
    }

    const sips: { [index: number]: number } = {};
    for (const sipInfo of requiredSips) {
        sips[sipInfo.sipsIndex] = selection.getSips(sipInfo.minSips);
    }

    const socialMediaPlatform = store.getState().settings.socialMediaPlatform;

    const formatted = TextFormatter.format(
        fragments,
        indexedPlayers,
        sips,
        socialMediaPlatform,
        x => translator.translate(`game.textFormatter.${x}`),
        selection,
        { boldPlayerNames: true, boldSips: true },
    );

    return { formatted: formatted, players };
}

export function selectText(
    selection: SelectionAlgorithm,
    selectedCard: TextCard,
    translator: Translator,
): string {
    const lang = translator.languageCode;

    const viableContents = selectedCard.content.filter(x =>
        _.some(x.translations, y => y.lang.toLocaleLowerCase() === lang),
    );
    const content = selection.selectRandomWeighted(viableContents, x => x.weight)!;
    return content.translations.find(x => x.lang === lang)!.content;
}
