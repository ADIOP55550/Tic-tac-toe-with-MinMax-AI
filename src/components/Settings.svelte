<script lang="ts">
   import { onMount } from 'svelte';
   import { get } from 'svelte/store';
   import { slide, fly } from 'svelte/transition';

   import { Player } from '../Player';
   import { PlayerSymbol } from '../PlayerSymbol';
   import { players } from '../PlayerUtils';
   import {
      autoRestart,
      board,
      configurationErrors,
      currentAIs,
      currentAllowedSymbols,
      currentDefaultPlayersConfiguration,
      currentMaxPlayers,
      endOfRoundTime,
      gameVariant,
      showBotHead,
      throttleTime,
   } from '../stores';
   import gameVariants, { variantIds } from '../Variants';

   let expand = true;

   let settingsHandleShow = '';

   onMount(() => {
      if (!expand)
         setTimeout(() => {
            settingsHandleShow = 'show';
            setTimeout(() => {
               settingsHandleShow = '';
            }, 2000);
         }, 1000);
   });

   gameVariant.subscribe(() => {
      board.reset();
   });
</script>

<div class="settings" class:expand>
   <label for="variantSelect">Game variant:</label>
   <select name="variant" id="variantSelect" bind:value={$gameVariant}>
      {#each variantIds as variantId}
         <option
            value={gameVariants[variantId]}
            title={gameVariants[variantId].description}
         >
            {gameVariants[variantId].name}
            ({gameVariants[variantId].minPlayers}{gameVariants[variantId]
               .maxPlayers != gameVariants[variantId].minPlayers
               ? '-' + gameVariants[variantId].maxPlayers
               : ''} players)
         </option>
      {/each}
   </select>

   <button
      title="Reset players configuration and board"
      on:click={() => {
         // deep copy players
         players.set(
            get(currentDefaultPlayersConfiguration).map((v) => v.clone())
         );
         board.reset();
      }}>↺</button
   >

   <div>
      {#each $players as player}
         <div class="playerSetting">
            <span class="playerName">
               {@html player}
            </span>
            <div class="AISetting">
               AI:
               <select
                  bind:value={player.AI}
                  class:invalid={player.AI && !$currentAIs.has(player.AI)}
               >
                  {#each [null, ...$currentAIs] as AI}
                     <option value={AI}>{AI?.name || 'None'}</option>
                  {/each}
               </select>
            </div>
            <div class="symbolSetting">
               Symbol:
               <select
                  bind:value={player.symbol}
                  on:input={() => board.reset()}
                  class:invalid={player.symbol &&
                     !$currentAllowedSymbols.has(player.symbol)}
               >
                  {#each Array.from($currentAllowedSymbols.values()) as s}
                     <option value={s}>{PlayerSymbol[s]}</option>
                  {/each}
               </select>
            </div>
         </div>
      {/each}
      {#if $players.length < $currentMaxPlayers}
         <button
            on:click={() => {
               $players.push(new Player(get(players).length));
            }}>Add player</button
         >
      {/if}
   </div>

   <div>
      <label for="autoRestartCheckbox">
         <input
            type="checkbox"
            name="autoRestart"
            id="autoRestartCheckbox"
            bind:checked={$autoRestart}
         />
         Auto restart
      </label>
      {#if $autoRestart}
         <label for="endOfRoundTimeInput" transition:slide={{ duration: 100 }}>
            Wait time after round end (ms):
            <input
               type="number"
               min="100"
               max="10000"
               step="100"
               name="endOfRoundTime"
               title="wait after end of round (ms)"
               id="endOfRoundTimeInput"
               disabled={!$autoRestart}
               bind:value={$endOfRoundTime}
            />
         </label>
      {/if}
   </div>
   <div>
      <label for="throttleTimeInput">
         Minimum AI move duration (ms):
         <input
            type="number"
            min="0"
            max="10000"
            step="100"
            name="throttleTime"
            title="throttle time (ms)"
            id="throttleTimeInput"
            bind:value={$throttleTime}
         />
      </label>
   </div>
   <div>
      <label for="botHeadCheckbox">
         <input
            type="checkbox"
            name="botHead"
            id="botHeadCheckbox"
            bind:checked={$showBotHead}
         />
         Show bot head
      </label>
   </div>

   <div
      class="expand-handle"
      class:show={settingsHandleShow}
      class:invalid={$configurationErrors.length > 0}
      on:click={() => {
         expand = !expand;
      }}
   >
      <span class="icon">⚙</span><span class="text">Settings</span>
   </div>

   <div class="errors">
      <ul>
         {#each $configurationErrors as err (err)}
            <li transition:fly={{ x: 100 }}>{err}</li>
         {/each}
      </ul>
   </div>
</div>

<style>
   .settings {
      border: 1px solid black;
      width: fit-content;
      padding: 2em;
      position: absolute;
      right: 0;
      top: 50%;
      transform: translate(100%, -50%);
      transition: transform 0.3s;
      min-width: 30em;
      background-color: white;
   }
   .settings.expand {
      transform: translate(0, -50%);
   }
   .invalid {
      outline: red solid 1px;
   }
   .icon {
      font-size: 1.5em;
      width: 2rem;
      height: 2rem;
      display: inline-block;
      vertical-align: middle;
      text-align: center;
      color: white;
      user-select: none;
      transition: transform 0.6s;
   }
   .text {
      text-overflow: unset;
      display: inline-block;
      position: absolute;
      margin-left: 0.5em;
      top: 50%;
      transform: translate(0, -50%);
      color: white;
      user-select: none;
   }
   .expand-handle {
      width: 2rem;
      height: 2rem;
      background-color: gray;
      position: absolute;
      left: 0;
      overflow: hidden;
      transition: all 0.6s;
      transform: translateX(-100%);
   }
   .expand-handle.invalid {
      background-color: red;
   }

   .expand-handle:hover,
   .expand-handle.show {
      width: 7em;
      transform: translateX(-100%);
   }

   .expand-handle:hover .icon,
   .expand-handle.show .icon {
      transform: rotateZ(-300deg);
   }

   .errors {
      color: red;
   }

   .playerSetting {
      background-color: rgb(242, 242, 242);
      padding: 1em;
      margin-bottom: 4px;
   }
   .playerName {
      font-size: larger;
      display: inline-block;
      padding: 0 0.2em 0.4em;
   }
</style>
