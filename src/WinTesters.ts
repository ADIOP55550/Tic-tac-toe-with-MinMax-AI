/*
 *   Copyright (c) 2022
 *   All rights reserved.
 */

import { get } from 'svelte/store';
import type { CellArray } from './Board';
import type { Player } from './Player';
import { type TieType, Tie } from './PlayerSymbol';
import { turnHandler } from './PlayerUtils';

export type WinConditionTester = (
   cells: CellArray,
   lastPlayer?: Player
) => Player | undefined | TieType;

const defaultWinCombos = [
   [0, 1, 2],
   [3, 4, 5],
   [6, 7, 8],
   [0, 3, 6],
   [1, 4, 7],
   [2, 5, 8],
   [0, 4, 8],
   [2, 4, 6],
];

type WinTesters = {
   [index: string]: WinConditionTester;
};

const WinTester: WinTesters = {
   defaultTicTacToeWinTester: (cells) => {
      for (const combo of defaultWinCombos) {
         const firstCellInComboOwner = cells.at(combo[0])?.owner;
         if (firstCellInComboOwner == null) continue;
         if (
            combo.every(
               (cellId) =>
                  cells[cellId].owner != null &&
                  cells[cellId].owner == firstCellInComboOwner
            )
         ) {
            combo.forEach((cid) => cells[cid].highlight('#ff3e00'));
            // console.log('Player won! ', combo, firstCellInComboOwner);
            return firstCellInComboOwner;
         }
      }

      if (cells.every((c) => c.owner != null)) return Tie;

      return undefined;
   },

   onlyXWinTester: (cells, lastPlayer = get(turnHandler)) => {
      for (const combo of defaultWinCombos) {
         if (cells.at(combo[0]) == null) continue;
         if (combo.every((cellId) => cells[cellId].owner != null)) {
            // found winning combo
            combo.forEach((cid) => cells[cid].highlight('#ff3e00'));
            // console.log('Player won! ', combo, get(turnHandler));
            return lastPlayer;
         }
      }

      if (cells.every((c) => c.owner != null)) return Tie;

      return undefined;
   },
};

export default WinTester;
