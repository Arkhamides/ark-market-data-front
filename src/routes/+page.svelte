<script lang="ts">
  import "iconify-icon";
  import { onMount } from "svelte";
  import { connectWebSocket, subscribe } from "$lib/websocket";

  import OrderBookData from "$lib/components/order-book-data.svelte";

  let bids: { price: number; quantity: number }[] = [];
  let asks: { price: number; quantity: number }[] = [];

  onMount(() => {
    connectWebSocket();

    const unsubscribe = subscribe((data) => {
      if (data.bids && data.asks) {
        bids = data.bids.slice(0, 10); // top 10 bids
        asks = data.asks.slice(0, 10); // top 10 asks
      }
    });

    return unsubscribe;
  });
</script>

<svelte:head>
  <title>Ark Market Data</title>
</svelte:head>

<div
  class="content-wrap flex flex-col items-center justify-center h-[90vh] pt-16 pb-12 px-4 text-center"
>
  <OrderBookData {bids} {asks} />
</div>

<style>
  .content-wrap {
    overflow: clip;
    background: light-dark(#fff, #000);
    z-index: 2;
  }
  .content-wrap::before {
    --size: 45px;
    --line: color-mix(in lch, canvasText, transparent 70%);
    content: "";
    height: 100vh;
    width: 100vw;
    position: fixed;
    background:
      linear-gradient(90deg, var(--line) 1px, transparent 1px var(--size)) 50%
        50% / var(--size) var(--size),
      linear-gradient(var(--line) 1px, transparent 1px var(--size)) 50% 50% /
        var(--size) var(--size);
    mask: linear-gradient(-20deg, transparent 50%, white);
    top: 0;
    transform-style: flat;
    pointer-events: none;
  }
</style>
