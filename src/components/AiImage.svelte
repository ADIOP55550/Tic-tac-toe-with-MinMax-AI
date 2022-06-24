<script lang="ts">
   import { saying } from '../AIUtil';
   import SpeechBubble from './SpeechBubble.svelte';

   export let name = '';
</script>

<div class="wrapper">
   <img
      src="https://avatars.dicebear.com/api/bottts/{name}.svg?scale=88"
      alt="Bot head"
   />

   <SpeechBubble message={$saying} />
</div>

<style>
   img {
      max-width: 10em;
   }
   .wrapper {
      position: absolute;
      left: 4em;
      height: 10em;
      min-width: 10em;
      top: 20%;
      transform: translateY(-50%);
      display: flex;
      flex-flow: row nowrap;
      align-items: flex-start;
      justify-content: flex-start;
   }
</style>
