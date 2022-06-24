/*
 *   Copyright (c) 2022
 *   All rights reserved.
 */
import type Ai from './Ai';
import { PlayerSymbol } from './PlayerSymbol';

export class Player {
   // private static _id_count: number = 0;
   private _id: number;
   private _AI: Ai | null = null;
   public get AI(): Ai | null {
      return this._AI;
   }
   public set AI(value: Ai | null) {
      this._AI = value;
   }
   public get id() {
      return this._id;
   }
   private set id(v: number) {
      this._id = v;
   }

   symbol: PlayerSymbol;

   constructor(
      id: number,
      symbol: PlayerSymbol = PlayerSymbol.EMPTY,
      usedAI?: Ai
   ) {
      this.id = id;
      this._AI = usedAI || null;
      this.symbol = symbol;
   }

   toString() {
      return `Player <span class="playerId">#${
         this.id
      }</span> <span class="playerSymbol">(${
         PlayerSymbol[this.symbol]
      })</span> <span class="playerAI">${
         this.AI !== null ? '(AI)' : ''
      }</span>`;
   }

   clone() {
      let copy = new Player(this._id);
      copy._AI = this._AI;
      copy.symbol = this.symbol;
      return copy;
   }
}
