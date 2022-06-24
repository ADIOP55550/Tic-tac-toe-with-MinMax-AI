/*
 *   Copyright (c) 2022
 *   All rights reserved.
 */
import { get } from 'svelte/store';
import { GameCell } from './GameCell';
import type { Move } from './Move';
import { currentUsedWinTester } from './stores';

export type CellArray = Array<GameCell>;

export class Board {
   size: { width: number; height: number } = { width: 3, height: 3 };

   cells: CellArray = [];

   constructor({
      width = 3,
      height = 3,
   }: { width?: number; height?: number } = {}) {
      this.size = { width, height };

      // get list of width x height empty cells
      this.initializeBoard();
   }

   public getCellAt(x: number, y: number) {
      if (x >= this.size.width)
         throw new RangeError(
            `Cell x position  out of rage for size ${this.size.width}`
         );
      if (y >= this.size.height)
         throw new RangeError(
            `Cell y position  out of rage for siez ${this.size.height}`
         );

      return this.cells[y * this.size.width + x];
   }

   public setCellAt(x: number, y: number, newCellValue: GameCell) {
      if (x >= this.size.width)
         throw new RangeError(
            `Cell x position  out of rage for size ${this.size.width}`
         );
      if (y >= this.size.height)
         throw new RangeError(
            `Cell y position  out of rage for siez ${this.size.height}`
         );

      this.cells[y * this.size.width + x] = newCellValue;
   }

   public isMoveLegal(move: Move) {
      return move.cell.owner == null;
   }

   private initializeBoard() {
      this.cells = Array(this.size.width * this.size.height)
         .fill(0)
         .map((_, i) => new GameCell(i));
   }

   public testWinCondition() {
      return get(currentUsedWinTester)(this.cells);
   }
}
