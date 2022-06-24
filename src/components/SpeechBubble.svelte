<script>
   import { fade } from 'svelte/transition';
   export let message = '';
</script>

<div class="wrapper">
   {#if message}
      <div class="box sb2" transition:fade={{ duration: 300 }}>
         {message}&nbsp;
      </div>
   {/if}
</div>

<style>
   /* Bobbles by https://codepen.io/RajRajeshDn/pen/oZdRJw  */
   .box {
      width: 300px;
      margin: 50px;
      background: #00bfb6;
      padding: 20px;
      text-align: center;
      font-weight: 900;
      color: #fff;
      font-family: arial;
      position: relative;
   }
   .wrapper {
      pointer-events: none;
   }

   .sb2:before {
      content: '';
      width: 0px;
      height: 0px;
      position: absolute;
      border-left: 10px solid transparent;
      border-right: 10px solid #00bfb6;
      border-top: 10px solid #00bfb6;
      border-bottom: 10px solid transparent;
      left: -19px;
      top: 6px;
   }
</style>
