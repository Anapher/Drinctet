import { Weighted } from './types';

export type GenderRequirement = 'male' | 'female' | 'opposite' | 'same';
export type PlayerSetting = { playerIndex: number; genderRequirement?: GenderRequirement };

export interface CardBase {
   /** a unique id to identify the card */
   id: string;

   /** the optimal will power that is required for this card.
    * This should be a number between 1 and 5, or zero if it doesnt matter */
   willPower: number | undefined;

   /** the players that are required for this card with their settings */
   players: PlayerSetting[];

   /** tags of this card */
   tags: string[];
}

export type SingleTextContent = { [lang: string]: string };
export type MultipleTextContent = { [lang: string]: Weighted<string>[] };

export interface TextCard extends CardBase {
   content: SingleTextContent | MultipleTextContent;
}

export interface WouldYouRatherCard extends TextCard {
   type: 'wyr';
}

export interface TaskCard extends TextCard {
   type: 'task';
}

export type Card = WouldYouRatherCard | TaskCard;
