<script>
   export let show = false;
</script>

<!-- Spinner from https://codepen.io/sfi0zy/pen/OJbQwYr -->
<div class="container">
   <div class="block" class:show>
      <div class="item" />
      <div class="item" />
      <div class="item" />
      <div class="item" />
      <div class="item" />
      <div class="item" />
      <div class="item" />
      <div class="item" />
   </div>
</div>

<style>
   .container {
      position: relative;
      font-size: 5px;
      width: fit-content;
      margin: 3em auto 0;
      height: 6em;
      width: 6em;
   }
   .block {
      position: absolute;
      top: 0;
      left: 0;
      height: 2em;
      width: 2em;
      visibility: hidden;
   }
   .block.show {
      visibility: visible;
   }

   .block > .item {
      position: absolute;
      height: 2em;
      width: 2em;
      background: #ff3e00;
      -webkit-animation: move 0.5s linear infinite;
      animation: move 0.5s linear infinite;
   }
   .block > .item:nth-of-type(1) {
      top: 0;
      left: 0;
      -webkit-animation-delay: 0s;
      animation-delay: 0s;
   }
   .block > .item:nth-of-type(2) {
      top: 0;
      left: 2em;
      -webkit-animation-delay: -0.0625s;
      animation-delay: -0.0625s;
   }
   .block > .item:nth-of-type(3) {
      top: 0;
      left: 4em;
      -webkit-animation-delay: -0.125s;
      animation-delay: -0.125s;
   }
   .block > .item:nth-of-type(4) {
      top: 2em;
      left: 4em;
      -webkit-animation-delay: -0.1875s;
      animation-delay: -0.1875s;
   }
   .block > .item:nth-of-type(5) {
      top: 4em;
      left: 4em;
      -webkit-animation-delay: -0.25s;
      animation-delay: -0.25s;
   }
   .block > .item:nth-of-type(6) {
      top: 4em;
      left: 2em;
      -webkit-animation-delay: -0.3125s;
      animation-delay: -0.3125s;
   }
   .block > .item:nth-of-type(7) {
      top: 4em;
      left: 0;
      -webkit-animation-delay: -0.375s;
      animation-delay: -0.375s;
   }
   .block > .item:nth-of-type(8) {
      top: 2em;
      left: 0;
      -webkit-animation-delay: -0.4375s;
      animation-delay: -0.4375s;
   }
   @-webkit-keyframes move {
      0% {
         opacity: 0;
      }
      10% {
         opacity: 1;
      }
      70% {
         opacity: 0;
      }
      100% {
         opacity: 0;
      }
   }
   @keyframes move {
      0% {
         opacity: 0;
      }
      10% {
         opacity: 1;
      }
      70% {
         opacity: 0;
      }
      100% {
         opacity: 0;
      }
   }
</style>
