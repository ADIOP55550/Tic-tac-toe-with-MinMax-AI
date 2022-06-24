/*
 *   Copyright (c) 2022
 *   All rights reserved.
 */

import { get, writable } from 'svelte/store';
import type Ai from './Ai';
import type { CellArray } from './Board';
import type { Move } from './Move';
import type { Player } from './Player';
import { PlayerSymbol } from './PlayerSymbol';
import { turnHandler } from './PlayerUtils';
import { throttleTime, board, gameFinished } from './stores';

let handle: NodeJS.Timeout | undefined;

export function botSay(message: string, timeout: number = 0) {
   if (handle) clearTimeout(handle);
   saying.set(message);
   if (timeout > 0) {
      handle = setTimeout(() => {
         saying.set('');
      }, timeout);
   }
}

export let waitingForAI = writable(false);

export async function requestMoveFromAIAndExecuteItThrottledAs(
   ai: Ai,
   player: Player,
   minTime: number = get(throttleTime)
): Promise<Move> {
   const throttlePromise = new Promise((res) => setTimeout(res, minTime));
   const AiPromise = ai
      .getMove(get(board), player)
      .then((cell) => ({ cell, player }))
      .catch((err) => console.error(err));

   const move = (await Promise.all([AiPromise, throttlePromise]).then(
      ([move, _throttle]) => move
   )) as Move;

   if (!get(gameFinished))
      board.executeMoves({ cell: move.cell, player: get(turnHandler) });

   return Promise.resolve(move);
}

export async function AIMove(player: Player) {
   if (get(waitingForAI)) return;

   if (!get(gameFinished) && player?.AI) {
      waitingForAI.set(true);
      requestMoveFromAIAndExecuteItThrottledAs(player.AI, player).then(() =>
         waitingForAI.set(false)
      );
   }
}

export const saying = writable('');

export function prettyCells(cells: CellArray, highlight_id: number = -1) {
   let result = '';
   for (let x = 0; x < 3; x++) {
      let row = '';

      for (let y = 0; y < 3; y++) {
         let i = 3 * x + y;
         let cell = cells[i];
         row +=
            (i == highlight_id ? '[' : ' ') +
            (cell.isEmpty
               ? ' '
               : PlayerSymbol[cell.owner?.symbol as PlayerSymbol]) +
            (i == highlight_id ? ']' : ' ') +
            (y != 2 ? '|' : '');
      }
      row += '\n';
      result += row;
   }

   return result;
}

export const sayings = {
   taunt: [
      'I am better and you will see this!',
      'You can surrender now',
      'This position is not good for you',
      'This is easy win for me!',
      'Just give up',
      "You don't stand a chance",
      'Stop pretending like you know what you are doing',
   ],
   blunder: [
      "Now I'm going to win this!",
      'You should have thought twice!',
      'Are you trying to loose?',
      'Shame!',
      'Thank you, that helped me',
      'You blundered!',
      'Not like this!',
      'That was not the best move',
      'Why would you do that?',
      "You're only making it worse for yourself",
   ],
   tauntFirstMove: [
      'This is going to be easy!',
      'I have already won!',
      'I see the future... You will loose!',
      'You stand no chance!',
   ],
   firstMove: [
      "I'm not going easy on you",
      "Ok, let's do this",
      "Let's begin the game",
   ],
   goodMove: [
      "You're surprising me!",
      "That's a good one",
      'Though...',
      'You are good, but I am better',
      '',
      'Good move!',
      'I approve this move',
      'This would also be my choice',
      'I would have do the same',
   ],
   endWin: [
      'Yes!',
      'Horray!',
      "I'm the best",
      '🎉',
      'I knew this from the begginig',
      'You still need to learn a lot',
      'Maybe one day you will win',
      'Sorry, not sorry',
      'I won!',
   ],
   endDraw: [
      'Good game!',
      "You're an worthy opponent.",
      'Thank you for playing',
      'Nice',
      'Perfectly Balanced, as All Things Should Be',
      'Tie!',
      'Draw!',
      'You did great.',
   ],
   endLoose: [
      'Noooo! How is this possible!',
      'I must have malfunctioned!',
      'This should not have happened!',
      'Again! Again!',
      'Respect',
      'Congratulations',
      '👏',
      'Great game!',
   ],
};

export function getRandomSaying(category: keyof typeof sayings): string {
   return sayings[category][~~(Math.random() * sayings[category].length)];
}
