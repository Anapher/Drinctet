import { Card } from './types-cards';

export type Weighted<T> = { value: T; weight: number };

export type GameState = {
   players: Player[];
   settings: GameSettings;
};

export type GameSettings = {
   currentWillPower: number;
   lockWillPower: boolean;
   cardTypes: Weighted<Card['type']>[];
   tags: Weighted<string>[];
   cardCollections: Weighted<string>[]; // urls
};

export type Gender = 'male' | 'female';

export type Player = {
   id: number;
   name: string;
   gender: Gender;
};
