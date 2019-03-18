import { TextCard } from "@core/cards/text-card";
import { PlayerInfo } from "@core/player-info";
import { SelectionAlgorithm } from "@core/selection/selection-algorithm";
import Markdown, { ParsingOptions } from "markdown-to-jsx";
import * as React from "react";
import { LocalizeContextProps } from "react-localize-redux";
import _ from "underscore";
import { CachedTextFormatter } from "../../formatter/cached-text-formatter";
import { TextFormatter } from "../../formatter/text-formatter";
import {
    getStateBasedSelectionAlgorithm,
    selectPlayers,
    enqueueFollowUp,
    nextSlide,
    generateSeed,
} from "../../game-engine";
import { CardComponent, CardComponentProps } from "./card-component";
import { SelectedPlayer } from "GameModels";

interface TextCardComponentProps extends CardComponentProps, LocalizeContextProps {
    selectedPlayers: SelectedPlayer[];
    currentSeed: string;
}

export const defaultStyles = {
    markdownH1: {
        color: "white",
    },
};

function MyParagaph({ children, ...props }: any) {
    return (
        <p {...props} style={{ marginBlockStart: 5, marginBlockEnd: 5 }}>
            {children}
        </p>
    );
}

function MyH3({ children, ...props }: any) {
    return (
        <h3 {...props} style={{ marginBlockStart: 20, marginBlockEnd: 5 }}>
            {children}
        </h3>
    );
}

export abstract class TextCardComponent<
    TCard extends TextCard,
    TProps extends TextCardComponentProps,
    TState = {}
> extends CardComponent<TCard, TProps, TState> {
    readonly formatter = new CachedTextFormatter();

    initialize(card: TCard) {
        const seed = generateSeed();
        const selection = getStateBasedSelectionAlgorithm(seed);

        const text = this.selectText(selection, card);

        const fragments = this.formatter.parseTextFragments(text);
        const playerRequirements = TextFormatter.getRequiredPlayers(fragments, card.players);
        const players = selectPlayers(playerRequirements, card);

        this.didInitialize(card, players);

        if (_.any(card.followUp)) {
            // dont check for correct translation as the language may change
            if (Math.random() <= card.followUpPropability) {
                const due = new Date();
                due.setSeconds(due.getSeconds() + card.followUpDelay);

                enqueueFollowUp(due, card, players);
            }
        }
    }

    protected didInitialize(_card: TCard, _players: SelectedPlayer[]): void {}

    initializeFollowUp(card: TCard) {
        const seed = generateSeed();
        const selection = getStateBasedSelectionAlgorithm(seed);
        const text = this.selectFollowUpText(selection, card);

        const fragments = this.formatter.parseTextFragments(text);
        const playerRequirements = TextFormatter.getRequiredPlayers(fragments, card.players);
        const missingRequirements = playerRequirements.filter(
            x => !_.any(this.props.selectedPlayers, y => y.index === x.playerIndex),
        );
        if (missingRequirements.length > 0) {
            selectPlayers(missingRequirements, card);
        }
    }

    isLoaded() {
        if (this.props.selectedCard === null) {
            return false;
        }

        if (this.props.currentSeed === "") {
            return false;
        }

        const selection = getStateBasedSelectionAlgorithm();
        let text: string;
        if (this.props.followUp !== null) {
            text = this.selectFollowUpText(selection, this.props.selectedCard as TextCard);
        } else {
            text = this.selectText(selection, this.props.selectedCard as TextCard);
        }

        const fragments = this.formatter.parseTextFragments(text);
        const players = TextFormatter.getRequiredPlayers(
            fragments,
            this.props.selectedCard.players,
        );

        if (
            this.props.selectedPlayers === null ||
            this.props.selectedPlayers.length < players.length
        ) {
            return false;
        }

        return true;
    }

    selectText(selection: SelectionAlgorithm, selectedCard: TextCard): string {
        const lang = this.props.activeLanguage.code;

        const viableContents = selectedCard.content.filter(x =>
            _.any(x.translations, y => y.lang.toLocaleLowerCase() === lang),
        );
        const content = selection.selectRandomWeighted(viableContents, x => x.weight)!;
        return content.translations.find(x => x.lang === lang)!.content;
    }

    selectFollowUpText(selection: SelectionAlgorithm, selectedCard: TextCard): string {
        const lang = this.props.activeLanguage.code;

        const followUps = selectedCard.followUp.filter(x =>
            _.any(x.translations, y => y.lang.toLowerCase() === lang),
        );
        if (followUps.length === 0) {
            nextSlide();
            return "";
        }

        const translations = selection.selectRandomWeighted(followUps, x => x.weight)!.translations;
        return translations.find(x => x.lang === lang)!.content;
    }

    render() {
        if (this.checkIfInitializationRequired() || !this.isLoaded()) {
            return <div>Loading...</div>;
        }

        const selection = getStateBasedSelectionAlgorithm();
        const card = this.props.selectedCard as TextCard;

        let text: string;
        if (this.props.followUp !== null) {
            text = this.selectFollowUpText(selection, card);
        } else {
            text = this.selectText(selection, card);
        }

        const fragments = this.formatter.parseTextFragments(text);

        const indexedPlayers: { [index: number]: PlayerInfo } = {};
        for (const player of this.props.selectedPlayers) {
            indexedPlayers[player.index] = player.player;
        }

        const requiredSips = TextFormatter.getRequiredSips(fragments);

        const sips: { [index: number]: number } = {};
        for (const sipInfo of requiredSips) {
            sips[sipInfo.sipsIndex] = selection.getSips(sipInfo.minSips);
        }

        console.log(indexedPlayers);

        const formatted = this.formatter.format(
            fragments,
            indexedPlayers,
            sips,
            x => this.props.translate(`game.textFormatter.${x}`) as string,
            selection,
            { boldPlayerNames: true, boldSips: true },
        );

        const options: ParsingOptions = {
            overrides: {
                p: {
                    component: MyParagaph,
                    props: {},
                },
                h3: {
                    component: MyH3,
                    props: {},
                },
            },
        };

        return this.renderSlide(<Markdown children={formatted} options={options} />, selection);
    }

    protected abstract renderSlide(text: JSX.Element, selection: SelectionAlgorithm): JSX.Element;
}
