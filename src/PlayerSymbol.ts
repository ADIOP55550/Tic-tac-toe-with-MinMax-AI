/*
 *   Copyright (c) 2022
 *   All rights reserved.
 */

export enum PlayerSymbol {
   EMPTY,
   X,
   O
}

export const symbolToCharacterMap: Map<PlayerSymbol, string> = new Map([
   [PlayerSymbol.EMPTY, ' '],
   [PlayerSymbol.O, 'o'],
   [PlayerSymbol.X, 'x'],
]);


export const Tie = {};
export type TieType = typeof Tie;