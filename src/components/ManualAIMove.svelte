<script lang="ts">
   import { get } from 'svelte/store';
   import type Ai from '../Ai';

   import {
      AIMove,
      requestMoveFromAIAndExecuteItThrottledAs,
      waitingForAI,
   } from '../AIUtil';
   import { turnHandler } from '../PlayerUtils';
   import { configurationErrors, currentAIs, gameFinished } from '../stores';

   let usedAI: Ai | null = null;

   export function requestAIMove() {
      if (get(configurationErrors).length)
         return alert('Resolve settings errors first!');
      if (get(waitingForAI)) return;

      if (usedAI == null) {
         if (!get(turnHandler).AI)
            return alert('Current player has no AI assigned');
         return AIMove(get(turnHandler));
      }

      waitingForAI.set(true);
      requestMoveFromAIAndExecuteItThrottledAs(usedAI, get(turnHandler)).then(
         () => waitingForAI.set(false)
      );
   }
</script>

<div class="moveAiSelect">
   <select
      bind:value={usedAI}
      class:invalid={usedAI && !$currentAIs.has(usedAI)}
   >
      {#each [null, ...$currentAIs] as AI}
         <option value={AI}>{AI?.name || 'Default player AI'}</option>
      {/each}
   </select>
   <button on:click={requestAIMove} disabled={$gameFinished}
      >Move using this AI</button
   >
</div>

<style>
   .moveAiSelect {
      margin-top: 0.3em;
      font-size: small;
   }
</style>
