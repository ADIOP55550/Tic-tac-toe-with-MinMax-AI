/*
 *   Copyright (c) 2022
 *   All rights reserved.
 */

import type { Board } from './Board';
import type { GameCell } from './GameCell';
import type { Player } from './Player';
import { MinMaxAi } from './MinMaxAi';
import { OldMinMaxAi } from './OldMinMaxAi';
import { RandomAi } from './RandomAi';

export default interface Ai {
   getMove: (boardState: Board, asPlayer: Player) => Promise<GameCell>;
   name: string;
   reset: () => void;
}

export const RANDOM_AI = new RandomAi();
export const OLD_MINMAX_AI = new OldMinMaxAi();
export const MINMAX_AI = new MinMaxAi();

export const AIS: Array<Ai> = [RANDOM_AI, OLD_MINMAX_AI, MINMAX_AI];
