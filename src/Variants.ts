/*
 *   Copyright (c) 2022
 *   All rights reserved.
 */

import { Player } from './Player';
import type { WinConditionTester } from './WinTesters';
import WinTester from './WinTesters';
import { PlayerSymbol } from './PlayerSymbol';
import {
   defaultGetNextPlayerFunction,
   defaultGetPrevPlayerFunction,
   GetNextPlayerFunction,
} from './PlayerUtils';
import type { GameCell } from './GameCell';
import type { CellArray } from './Board';
import type Ai from './Ai';
import { RANDOM_AI, MINMAX_AI } from './Ai';

export interface GameVariant {
   name: string;
   description: string;
   usedWinTester: WinConditionTester;
   defaultPlayersConfiguration: Readonly<Array<Player>>;
   nextPlayerFunction: GetNextPlayerFunction;
   prevPlayerFunction: GetNextPlayerFunction;
   maxPlayers: number;
   minPlayers: number;
   AIs: Set<Ai>;
   allowedSybols: Set<PlayerSymbol>;
   allowLeftoverSymbols: boolean;
   generatePossibleMoves: (b: CellArray) => Generator<GameCell, null>;
}

const gameVariants = {
   defualt: {
      name: 'Default tic-tac-toe',
      description: 'Regular tic-tac-toe rules',
      usedWinTester: WinTester.defaultTicTacToeWinTester,
      nextPlayerFunction: defaultGetNextPlayerFunction,
      prevPlayerFunction: defaultGetPrevPlayerFunction,
      defaultPlayersConfiguration: [
         new Player(1, PlayerSymbol.O),
         new Player(2, PlayerSymbol.X),
      ],
      maxPlayers: 2,
      minPlayers: 2,
      AIs: new Set([RANDOM_AI, MINMAX_AI]),
      allowedSybols: new Set([PlayerSymbol.O, PlayerSymbol.X]),
      allowLeftoverSymbols: false,
      generatePossibleMoves: function* (cells: CellArray) {
         let i = 0;
         while (i < cells.length) {
            if (cells[i].isEmpty) yield cells[i];
            i++;
         }
         return null;
      },
   },
   onlyX: {
      name: 'Only X can be placed',
      description:
         'Players alternate placing X signs, first to create 3 in a line loses.',
      usedWinTester: WinTester.onlyXWinTester,
      nextPlayerFunction: defaultGetNextPlayerFunction,
      prevPlayerFunction: defaultGetPrevPlayerFunction,
      defaultPlayersConfiguration: [
         new Player(1, PlayerSymbol.X),
         new Player(2, PlayerSymbol.X, MINMAX_AI),
      ],
      maxPlayers: 2,
      minPlayers: 2,
      AIs: new Set([RANDOM_AI, MINMAX_AI]),
      allowedSybols: new Set([PlayerSymbol.X]),
      allowLeftoverSymbols: false,
      generatePossibleMoves: function* (cells: CellArray) {
         let i = 0;
         while (i < cells.length) {
            if (cells[i].isEmpty) yield cells[i];
            i++;
         }
         return null;
      },
   },
} as { [index: string]: GameVariant };

export const variantIds: Array<keyof typeof gameVariants> = Object.keys(
   gameVariants
) as Array<keyof typeof gameVariants>;

export default gameVariants as {
   [index in keyof typeof gameVariants]: GameVariant;
};
