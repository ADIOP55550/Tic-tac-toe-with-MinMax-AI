/*
 *   Copyright (c) 2022
 *   All rights reserved.
 */
import { get } from 'svelte/store';
import type { Board } from './Board';
import type { GameCell } from './GameCell';
import { gameVariant } from './stores';
import type Ai from './Ai';

export class RandomAi implements Ai {
   reset: () => void = () => null;
   name = 'Random AI';
   getMove: (boardState: Board) => Promise<GameCell> = (b) => {
      return new Promise((resolve, reject) => {
         const availableCells = Array.from(
            get(gameVariant).generatePossibleMoves(b.cells)
         );
         const chosenCell =
            availableCells[~~(Math.random() * availableCells.length)];
         console.log('I choose cell: ' + chosenCell);
         resolve(chosenCell);
      });
   };
}
