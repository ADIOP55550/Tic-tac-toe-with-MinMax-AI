<script lang="ts">
   import ManualAIMove from './ManualAIMove.svelte';
   import { get } from 'svelte/store';

   import type { GameCell } from '../GameCell';
   import {
      autoRestart,
      board,
      configurationErrors,
      endOfRoundTime,
      gameFinished,
   } from '../stores';
   import Cell from './Cell.svelte';
   import Spinner from './Spinner.svelte';
   import { AIMove, waitingForAI } from '../AIUtil';
   import { turnHandler } from '../PlayerUtils';

   function handleMove(cell: GameCell) {
      if (get(configurationErrors).length)
         return alert('Resolve settings errors first!');
      if (get(waitingForAI)) return;
      if (get(gameFinished)) return;
      if ($turnHandler.AI !== null) return;
      board.executeMoves({ cell, player: get(turnHandler) });
   }

   turnHandler.subscribe((player) => {
      // timeout for board state to settle
      setTimeout(AIMove.bind(this, player), 2);
   });

   gameFinished.subscribe((finished) => {
      if (finished && get(autoRestart)) {
         setTimeout(() => {
            board.reset();
         }, get(endOfRoundTime));
      }
   });
</script>

<div class="board">
   {#each $board.cells as cell}
      <Cell {cell} on:click={() => handleMove(cell)} />
   {/each}
</div>

<Spinner show={$waitingForAI} />
<ManualAIMove />

<style>
   @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300&display=swap');
   .board {
      display: grid;
      grid-template-columns: repeat(3, minmax(50px, 1fr));
      grid-template-rows: repeat(3, minmax(50px, 1fr));
      max-width: fit-content;
      margin: auto;
      gap: 0.3em;
      font-family: 'DM Mono', monospace;
      font-size: 2em;
   }
   :global(.board > *) {
      border: 1px black solid;
   }
</style>
