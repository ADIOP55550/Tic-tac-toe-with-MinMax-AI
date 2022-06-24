/*
 *   Copyright (c) 2022
 *   All rights reserved.
 */
import { get } from 'svelte/store';
import type { Board, CellArray } from './Board';
import type { GameCell } from './GameCell';
import type { GetNextPlayerFunction } from './PlayerUtils';
import type { Player } from './Player';
import { PlayerSymbol, Tie } from './PlayerSymbol';
import { gameVariant } from './stores';
import type { WinConditionTester } from './WinTesters';
import { botSay, getRandomSaying, prettyCells } from './AIUtil';
import type Ai from './Ai';

export class MinMaxAi implements Ai {
   readonly name = 'MinMax Ai';
   getNextPlayer!: GetNextPlayerFunction;
   logging = false;
   readonly cache: Map<Player, GameCell[]> = new Map();
   lastCached?: GameCell[];

   reset: () => void = () => {
      this.cache.clear();
      this.lastCached = undefined;
   };
   lastChosen: MoveCandidate;

   pretendMove(state: CellArray, cell: GameCell, player: Player) {
      const copy = state.map((v) => v.clone());
      copy[cell.id].owner = player;
      return copy;
   }

   evaluate(state: CellArray, asPlayer: Player, tester?: WinConditionTester) {
      if (!tester) tester = get(gameVariant).usedWinTester;
      const winState = tester(
         state,
         get(gameVariant).prevPlayerFunction(asPlayer)
      );
      return winState === asPlayer
         ? 1
         : winState === Tie
         ? 0
         : winState //anyone else won
         ? -1
         : undefined; //game not finished
   }

   expandTree: (cells: CellArray, asPlayer: Player) => MoveCandidate = (
      cells,
      asPlayer
   ) => {
      const movesGenerator = get(gameVariant).generatePossibleMoves(cells);

      let val;

      let currBestMove: MoveCandidate | null = null;

      while (!(val = movesGenerator.next()).done) {
         const cellsAfterMove = this.pretendMove(cells, val.value, asPlayer);
         const positionEval = this.evaluate(cellsAfterMove, asPlayer);

         if (this.logging)
            console.info(
               `Player ${asPlayer.id} [${
                  PlayerSymbol[asPlayer.symbol]
               }] makes move:\n${prettyCells(
                  cellsAfterMove,
                  val.value.id
               )}\neval: ${positionEval}`
            );

         if (positionEval !== undefined) {
            // game finished
            if (positionEval === 1) {
               // if we won, we can assume that we will make this move
               if (this.logging)
                  console.info(
                     `Found winnning move, returning eval 1 for player  ${
                        asPlayer.id
                     } [${PlayerSymbol[asPlayer.symbol]}]!\n${prettyCells(
                        cellsAfterMove,
                        val.value.id
                     )}`
                  );

               return {
                  eval: positionEval,
                  moves: [val.value],
               };
            }

            if (!currBestMove || positionEval > currBestMove.eval) {
               if (this.logging)
                  console.info(
                     `New best move found for player  ${asPlayer.id} [${
                        PlayerSymbol[asPlayer.symbol]
                     }]!\n${prettyCells(cellsAfterMove, val.value.id)}`
                  );
               currBestMove = {
                  eval: positionEval,
                  moves: [val.value],
               };
            }
            continue;
         }

         // game not finished, recurse
         const nextPlayer = this.getNextPlayer(asPlayer);

         const bestMoveForOpponent = this.expandTree(
            cellsAfterMove,
            nextPlayer
         );

         // if next player is not us, we multiply their eval by -1 to get our eval
         const evalForUs =
            nextPlayer === asPlayer
               ? bestMoveForOpponent.eval
               : -bestMoveForOpponent.eval;

         if (
            !currBestMove || // best move not yet found
            evalForUs > currBestMove.eval || // or current move is better
            (evalForUs == currBestMove.eval &&
               bestMoveForOpponent.moves.length > currBestMove.moves.length) // or current move is equal and game will be longer after this move
         ) {
            if (this.logging)
               console.info(
                  `New best expanded move found for player ${asPlayer.id} [${
                     PlayerSymbol[asPlayer.symbol]
                  }]!\n${prettyCells(cellsAfterMove, val.value.id)}`
               );
            currBestMove = {
               eval: evalForUs,
               moves: [val.value, ...bestMoveForOpponent.moves],
            };
         }
      }

      if (currBestMove === null) throw new Error('Could not find best move');

      if (this.logging)
         console.log(
            `Reached end, best move for player ${asPlayer.id} [${
               PlayerSymbol[asPlayer.symbol]
            }] is\n${prettyCells(cells, currBestMove.moves[0].id)}`
         );

      return currBestMove;
   };

   getMove: (boardState: Board, asPlayer: Player) => Promise<GameCell> = (
      boardState,
      asPlayer
   ) => {
      this.getNextPlayer = get(gameVariant).nextPlayerFunction;
      return new Promise((resolve, reject) => {
         testCache: if (this.cache.has(asPlayer)) {
            console.info('Checking cache...');
            let nextPlayer = asPlayer;
            const ourCache = this.cache.get(asPlayer);
            // until it's our turn again
            while ((nextPlayer = this.getNextPlayer(nextPlayer)) !== asPlayer) {
               // get next predicted move
               const predictedMove = ourCache?.shift();
               if (!predictedMove) break testCache;

               // if prediction was incorrect, break
               if (boardState.cells[predictedMove.id].owner !== nextPlayer) {
                  console.warn(
                     `Prediction was wrong! Expected Player ${
                        nextPlayer.id
                     } in cell ${predictedMove.id}, ${
                        boardState.cells[predictedMove.id].owner?.id
                     } found.`
                  );
                  break testCache;
               }
               console.info(
                  `Prediction was correct! Expected Player ${nextPlayer.id} in cell ${predictedMove.id}.`
               );
            }

            // cache was correct,
            // move according to prediction
            const ourMove = ourCache?.shift();
            if (!ourMove) break testCache;
            console.info('Moving according to prediction!');
            return resolve(ourMove);
         }

         // clear cache as it was either wrong or empty
         this.cache.delete(asPlayer);

         try {
            const chosen = this.expandTree(boardState.cells, asPlayer);
            const moveToMake = chosen.moves.shift();

            if (chosen.eval === 1) {
               if (boardState.cells.filter((c) => c.isEmpty).length == 9)
                  botSay(getRandomSaying('tauntFirstMove'), 1500);
               else {
                  if (this.lastChosen && this.lastChosen.eval > chosen.eval)
                     botSay(getRandomSaying('blunder'), 1500);
                  else botSay(getRandomSaying('taunt'), 1500);
               }
            } else {
               if (boardState.cells.filter((c) => c.isEmpty).length == 9)
                  botSay(getRandomSaying('firstMove'), 1500);
               botSay(getRandomSaying('goodMove'), 1500);
            }

            this.cache.set(asPlayer, chosen.moves);
            this.lastCached = chosen.moves.map((v) => v.clone());

            if (!moveToMake) throw new Error('move to make is falsy');
            this.lastChosen = chosen;
            resolve(moveToMake);
         } catch (e) {
            reject(e);
         }
      });
   };
}
interface MoveCandidate {
   moves: GameCell[];
   eval: number;
}

export type ExpandResult = {
   evalForThem: number;
   path: Array<number>;
};
