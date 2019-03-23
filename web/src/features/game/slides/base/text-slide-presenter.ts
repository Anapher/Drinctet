import { MelinaAlgorithm } from './../../../../core/selection/melina-algorithm';
import { TextCard } from "@core/cards/text-card";
import { CardPresenter } from "./card-presenter";
import * as gameEngine from "../../game-engine";
import * as actions from "../../actions";
import { SelectionAlgorithm } from "@core/selection/selection-algorithm";
import { TextFormatter } from "../../formatter/text-formatter";
import { PlayerInfo } from "@core/player-info";
import { FollowUpSlide, SelectedPlayer, Translator } from "GameModels";
import _ from "lodash";
import { RootAction } from "DrinctetTypes";

export interface TextSlideState {
    markdownContent: string;
}

export abstract class TextSlidePresenter<
    TState extends TextSlideState,
    TCard extends TextCard
> extends CardPresenter<TCard> {
    private readonly formatter = new TextFormatter();

    constructor(protected translator: Translator, cardType: string, slideType: string) {
        super(cardType, slideType);
    }

    protected initializeCard(card: TCard): RootAction[] {
        const selection = gameEngine.getRandomSelectionAlgorithm();
        const result = new Array<RootAction>();

        const text = this.selectText(selection, card);
        const { formatted, players } = this.formatText(text, card, null, selection);

        const state = this.initializeState(formatted, card, players, selection);
        result.push(actions.setSlideState({state, insights: (selection as MelinaAlgorithm).insights.playerSelection}));

        if (_.some(card.followUp)) {
            // dont check for correct translation as the language may change
            if (Math.random() <= card.followUpPropability) {
                const due = new Date();
                due.setSeconds(due.getSeconds() + card.followUpDelay);

                result.push(actions.enqueueFollowUp(this.createFollowUp(card, players, due)));
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
            return [actions.setSlideState({state, insights: (selection as MelinaAlgorithm).insights.playerSelection})];
        } catch (error) { //no follow up found
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

    protected createFollowUp(card: TCard, players: SelectedPlayer[], due: Date): FollowUpSlide {
        return {
            due: due,
            slideType: this.slideType,
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

        const players = gameEngine.selectPlayers(selection, playerRequirements, definedPlayers || [], card);

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
            x => this.translator.translate(`game.textFormatter.${x}`),
            selection,
            { boldPlayerNames: true, boldSips: true },
        );

        return { formatted: formatted, players };
    }

    selectText(selection: SelectionAlgorithm, selectedCard: TextCard): string {
        const lang = this.translator.languageCode;

        const viableContents = selectedCard.content.filter(x =>
            _.some(x.translations, y => y.lang.toLocaleLowerCase() === lang),
        );
        const content = selection.selectRandomWeighted(viableContents, x => x.weight)!;
        return content.translations.find(x => x.lang === lang)!.content;
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
