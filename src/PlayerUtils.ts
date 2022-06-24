/*
 *   Copyright (c) 2022
 *   All rights reserved.
 */
import { derived, get, Updater, Writable, writable } from 'svelte/store';
import type { Player } from './Player';

export type GetNextPlayerFunction = (
   player: Player,
   defaultPlayer?: Player
) => Player;

export const defaultGetNextPlayerFunction = (
   player: Player,
   defaultPlayer = get(firstPlayer)
) => {
   let p = get(players);
   const i = p.indexOf(player);
   if (i < 0) return defaultPlayer;

   let index = (i + 1) % p.length;
   return p[index];
};

export const defaultGetPrevPlayerFunction = (
   player: Player,
   defaultPlayer = get(firstPlayer)
) => {
   let p = get(players);
   const i = p.indexOf(player);
   if (i < 0) return defaultPlayer;
   // ((n % m) + m) % m
   let index = (((i - 1) % p.length) + p.length) % p.length;
   return p[index];
};

export let getNextPlayer: GetNextPlayerFunction = defaultGetNextPlayerFunction;

export const players: Writable<Player[]> = writable([]);

export let firstPlayer = derived(players, (p) => p[0]);

export function getTurnHandler() {
   const { subscribe, set, update } = writable(get(firstPlayer));

   const newUpdate = (updater: Updater<Player>) => {
      const newUpdater: Updater<Player> = (x) => {
         console.log('Now player is ' + x);
         return updater(x);
      };
      update(newUpdater);
   };

   return {
      subscribe,
      set,
      update: newUpdate,
      next: () => newUpdate(getNextPlayer),
      reset: () => set(get(firstPlayer)),
   };
}

export let turnHandler = getTurnHandler();
