<script lang="ts">
   import Board from './components/Board.svelte';
   import { Tie } from './PlayerSymbol';
   import Settings from './components/Settings.svelte';
   import {
      board,
      currentDefaultPlayersConfiguration,
      gameFinished,
      playerWon,
      results,
      showBotHead,
   } from './stores';
   import AiImage from './components/AiImage.svelte';
   import { derived, get } from 'svelte/store';
   import { botSay, getRandomSaying } from './AIUtil';
   import type { Player } from './Player';
   import Results from './components/Results.svelte';
   import { onMount } from 'svelte';
   import { slide, fly, fade } from 'svelte/transition';
   import { players, turnHandler } from './PlayerUtils';

   const aiPlayers = derived(players, (p) => p.filter((v) => v.AI));

   let showInfo = false;

   onMount(() => {
      players.set(
         get(currentDefaultPlayersConfiguration).map((v) => v.clone())
      );
      board.reset();
      document.querySelector('body>div.notHostedInfo')?.remove();
   });

   aiPlayers.subscribe((aiPls) => {
      if (aiPls.length === 1) {
         const p = aiPls[0];
         botSay("Hello, I'm " + p.AI?.name, 2000);
      }
   });

   playerWon.subscribe((won) => {
      if (!won) return;

      results.update((v) => [...v, won]);

      if (get(aiPlayers).length !== 1) return;

      if (won === Tie) botSay(getRandomSaying('endDraw'), 3000);
      else if ((won as Player).AI) {
         botSay(getRandomSaying('endWin'), 3000);
      } else {
         botSay(getRandomSaying('endLoose'), 3000);
      }
   });
</script>

<main>
   <h1>Tic tac toe</h1>
   <div class="left">
      {#if $players.filter((v) => v.AI).length == 1 && $showBotHead}
         <div transition:slide>
            <AiImage
               name={($players.filter((v) => v.AI)[0].AI?.name || '') +
                  ~~(Math.random() * 100)}
            />
         </div>
      {/if}
   </div>

   <div class="infoIcon" on:click={() => (showInfo = !showInfo)}>🛈</div>
   {#if showInfo}
      <div class="modal" transition:fade>
         <span class="closeBtn" on:click={() => (showInfo = false)}>⮾</span>

         Tic Tac Toe application and AI algorithms <br />created using
         <a href="https://svelte.dev/">Svelte</a>
         by
         <a href="https://github.com/ADIOP55550">Adrian Klamut (ADIOP55550)</a>.
         <br />
         <br />
         All rights reserved &copy; 2022 Adrian Klamut.

         <br />
         <br />

         Bottts avatars from
         <a href="https://avatars.dicebear.com/">Dicebear</a>, created by
         <a href="https://twitter.com/pablostanley">Pablo Stanley</a>
         from <a href="https://bottts.com/">bottts.com</a>
      </div>
   {/if}

   <Board />
   <br />
   <div class="gameInfo">
      {#if $gameFinished}
         {#if $playerWon == Tie}
            <h2>It's a tie!</h2>
         {:else}
            <h2>
               Player won: {@html $playerWon}
            </h2>
         {/if}
      {:else}
         <h4>
            To play:
            {#key $turnHandler}
               <span in:fly>
                  {@html $turnHandler}
               </span>
            {/key}
         </h4>
      {/if}
   </div>
   <button on:click={() => board.reset()}>Play Again</button>
</main>
<Results results={$results} />
<Settings />

<style>
   :global(body) {
      overflow-x: hidden;
   }

   .gameInfo {
      height: 3em;
   }
   main {
      text-align: center;
      padding: 1em;
      max-width: 240px;
      margin: 0 auto;
      width: fit-content;
   }

   h1 {
      color: #ff3e00;
      text-transform: uppercase;
      font-size: 4em;
      font-weight: 100;
   }

   @media (min-width: 640px) {
      main {
         max-width: none;
      }
   }

   .infoIcon {
      cursor: pointer;
      user-select: none;
      position: absolute;
      top: 1em;
      right: 1em;
   }

   .modal .closeBtn {
      cursor: pointer;
      user-select: none;
      display: block;
      position: absolute;
      top: 0.5em;
      right: 0.7em;
   }

   .modal {
      z-index: 2;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 3em;
      background-color: whitesmoke;
      box-shadow: rgba(0, 0, 0, 0.187) 2px 2px 10px 2px;
   }

   .left {
      pointer-events: none;
   }
</style>
