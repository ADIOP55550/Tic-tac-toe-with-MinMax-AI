<script lang="ts">
   import type { Player } from '../Player';
   import { Tie, TieType } from '../PlayerSymbol';
   import { results as resultsStore } from '../stores';
   import { fade, slide } from 'svelte/transition';
   import { cubicInOut } from 'svelte/easing';
   import { players } from '../PlayerUtils';

   export let results: Array<Player | TieType> = [];

   let show = true;

   let wrapper: HTMLElement;

   resultsStore.subscribe(() => {
      setTimeout(() => {
         if (wrapper) wrapper.scrollTop = wrapper.scrollHeight;
      }, 10);
   });
</script>

<div class="wrapper">
   <div class="buttons">
      <button
         on:click={() => {
            show = !show;
         }}>Toggle results</button
      >
      {#if show}
         <button on:click={() => resultsStore.set([])} transition:fade
            >Clear</button
         >
      {/if}
   </div>
   {#if show}
      <div
         class="tablewrapper"
         bind:this={wrapper}
         transition:slide={{
            // delay: 250,
            duration: 300,
            // y: 300,
            // opacity: 0.5,
            easing: cubicInOut,
         }}
      >
         <table>
            <thead>
               <tr>
                  <th>Game</th>
                  <th>{@html $players[0]} won</th>
                  <th>Draw</th>
                  <th>{@html $players[1]} won</th>
               </tr>
            </thead>
            <tbody>
               {#each results as result, index (index)}
                  <tr in:fade|local={{ duration: 200 }}>
                     <td>
                        {index + 1}
                     </td>
                     <td>
                        {#if result === $players[0]}
                           x
                        {/if}
                     </td>
                     <td>
                        {#if result === Tie}
                           x
                        {/if}
                     </td>
                     <td>
                        {#if result === $players[1]}
                           x
                        {/if}
                     </td>
                  </tr>
               {:else}
                  <tr>
                     <td colspan="4">Brak rozegranych gier</td>
                  </tr>
               {/each}
            </tbody>
            <tfoot>
               <tr>
                  <td>Sum:</td>
                  <td>{results.filter((v) => v === $players[0]).length}</td>
                  <td>{results.filter((v) => v === Tie).length}</td>
                  <td>{results.filter((v) => v === $players[1]).length}</td>
               </tr>
            </tfoot>
         </table>
      </div>
   {/if}
</div>

<style>
   .wrapper {
      position: absolute;
      left: 1em;
      bottom: 2em;
      max-width: 35em;
      /* z-index: 3; */
   }

   .tablewrapper {
      height: 200px;
      overflow: auto;
      border: 1px solid black;
      scroll-behavior: smooth;
   }

   button {
      margin: 0.3em;
      width: 10em;
   }

   table td,
   table th {
      padding: 0.4em 0.7em;
   }

   table {
      border-collapse: collapse;
   }

   tbody tr {
      background-color: rgb(248, 248, 248);
   }

   tbody tr:nth-child(even) {
      background-color: rgb(233, 233, 233);
   }

   thead {
      position: sticky;
      background-color: white;
      top: 0;
   }
   tfoot {
      position: sticky;
      background-color: white;
      bottom: 0;
   }

   tbody {
      overflow-y: auto;
      max-height: 10em;
   }
</style>
