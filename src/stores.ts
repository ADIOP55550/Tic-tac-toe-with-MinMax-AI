/*
 *   Copyright (c) 2022
 *   All rights reserved.
 */

import { derived, Writable, writable } from 'svelte/store';
import { Board } from './Board';
import { players, turnHandler } from './PlayerUtils';
import type { Move } from './Move';
import gameVariants, { type GameVariant } from './Variants';
import type { Player } from './Player';
import { PlayerSymbol, TieType } from './PlayerSymbol';
import { AIS } from './Ai';

export const gameVariant: Writable<GameVariant> = writable(gameVariants.onlyX);

export const currentName = derived(gameVariant, (v) => v.name);
export const currentDescription = derived(gameVariant, (v) => v.description);
export const currentUsedWinTester = derived(
   gameVariant,
   (v) => v.usedWinTester
);
export const currentDefaultPlayersConfiguration = derived(
   gameVariant,
   (v) => v.defaultPlayersConfiguration
);
export const currentNextPlayerFunction = derived(
   gameVariant,
   (v) => v.nextPlayerFunction
);
export const currentMaxPlayers = derived(gameVariant, (v) => v.maxPlayers);
export const currentMinPlayers = derived(gameVariant, (v) => v.minPlayers);
export const currentAIs = derived(gameVariant, (v) => v.AIs);
export const currentAIIds = derived(currentAIs, (v) => Object.keys(v));

export const currentAllowedSymbols = derived(
   gameVariant,
   (v) => v.allowedSybols
);

export const autoRestart = writable(false);
export const showBotHead = writable(true);

export const results: Writable<Array<Player | TieType>> = writable([]);

gameVariant.subscribe(() => {
   results.set([]);
});

export const throttleTime = writable(400);
export const endOfRoundTime = writable(400);

function createBoard() {
   const { subscribe, set, update } = writable(new Board());

   return {
      subscribe,
      executeMoves: (...moves: Move[]) => {
         update((b) => {
            for (const move of moves) {
               if (!b.isMoveLegal(move)) {
                  alert('This move is illegal');
                  return b;
               }
               turnHandler.next();
               const { cell, player } = move;
               const foundCell = b.cells.find((c) => c.id == cell.id);
               if (foundCell === undefined) throw new Error('cell not found');
               foundCell.owner = player;
            }
            return b;
         });
      },
      reset: () => {
         set(new Board());
         turnHandler.reset();
         AIS.forEach((v) => v.reset());
      },
   };
}

export const board = createBoard();

export const playerWon = derived(board, (board) => {
   return board.testWinCondition();
});

export const gameFinished = derived(playerWon, (player) => {
   return player != undefined;
});

export const configurationErrors = derived(
   [
      currentAllowedSymbols,
      currentMinPlayers,
      currentMaxPlayers,
      currentAIs,
      players,
      gameVariant,
   ],
   ([allowedSymbols, minPlayers, maxPLayers, allowedAIs, p, variant]) => {
      const errors = [];
      if (p.length < minPlayers) errors.push('Too few players');

      if (p.length > maxPLayers) errors.push('Too many players');

      p.forEach(
         (v) =>
            !allowedSymbols.has(v.symbol) &&
            errors.push(
               'Player #' + v.id + ' has symbol that is not currently allowed'
            )
      );

      p.forEach(
         (v) =>
            v.AI &&
            !allowedAIs.has(v.AI) &&
            errors.push(
               'Player #' + v.id + ' has AI that is not currently allowed'
            )
      );

      console.assert(
         p.filter((v) => v.AI && !allowedAIs.has(v.AI)),
         'Players have not allowed AIS: ',
         allowedAIs,
         p
      );

      if (!variant.allowLeftoverSymbols) {
         let leftoverSymbols = new Set(allowedSymbols);

         p.forEach((v) => leftoverSymbols.delete(v.symbol));

         leftoverSymbols.forEach((s) => {
            errors.push('Symbol ' + PlayerSymbol[s] + ' was not assigned');
         });
      }

      return errors;
   },
   ['not set up']
);
