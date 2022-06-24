/*
 *   Copyright (c) 2022
 *   All rights reserved.
 */
import type { Player } from './Player';
import { PlayerSymbol } from './PlayerSymbol';

export class GameCell {
   id: number;
   owner?: Player = undefined;
   _highlight = '';

   constructor(id: number) {
      this.id = id;
   }

   get isEmpty() {
      return this.owner === undefined;
   }

   toString() {
      return `Cell #${this.id} [${
         PlayerSymbol[this.owner?.symbol || PlayerSymbol.EMPTY]
      }]`;
   }

   highlight(color: string) {
      this._highlight = color;
   }

   clone() {
      const copy = new GameCell(this.id);
      copy.owner = this.owner;
      copy._highlight = this._highlight;
      return copy;
   }
}
