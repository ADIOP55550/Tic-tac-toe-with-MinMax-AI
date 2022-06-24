<script lang="ts">
   import { symbolToCharacterMap } from '../PlayerSymbol';
   import type { GameCell } from '../GameCell';
   import { PlayerSymbol } from '../PlayerSymbol';
   import { configurationErrors } from '../stores';
   export let cell: GameCell;

   $: color = cell._highlight;
</script>

<div
   on:click
   class:disabled={$configurationErrors.length > 0}
   style={'color:' + color}
>
   {symbolToCharacterMap.get(cell.owner?.symbol || PlayerSymbol.EMPTY)}
</div>

<style>
   div {
      display: flex;
      align-items: center;
      justify-content: center;
      user-select: none;
   }

   .disabled {
      background-color: lightgray;
      color: gray;
   }
</style>
