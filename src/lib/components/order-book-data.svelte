<script lang="ts">
  export let bids: { price: number; quantity: number }[] = [];
  export let asks: { price: number; quantity: number }[] = [];

  $: maxBidQuantity = bids.length > 0 ? Math.max(...bids.map(b => b.quantity)) : 1;
  $: maxAskQuantity = asks.length > 0 ? Math.max(...asks.map(a => a.quantity)) : 1;
</script>

<div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-900 text-white font-mono rounded-lg shadow-lg">
  <div>
    <h2 class="text-green-400 text-lg font-semibold mb-2 border-b border-green-600 pb-1">Bids</h2>
    <table class="w-full text-sm">
      <thead class="text-gray-400 uppercase tracking-wider border-b border-gray-700">
        <tr>
          <th class="text-left py-2">Price</th>
          <th class="text-left py-2">Qty</th>
        </tr>
      </thead>
      <tbody>
        {#each bids as level}
          <tr class="hover:bg-green-950 transition relative">
            <td class="py-1 text-green-300">{level.price.toFixed(2)}</td>
            <td class="py-1 relative">
              <div
                class="absolute inset-0 bg-gradient-to-r from-green-500/20 to-green-500/5 rounded"
                style="width: {(level.quantity / maxBidQuantity) * 100}%"
              />
              <span class="relative z-10">{level.quantity.toFixed(2)}</span>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <div>
    <h2 class="text-red-400 text-lg font-semibold mb-2 border-b border-red-600 pb-1">Asks</h2>
    <table class="w-full text-sm">
      <thead class="text-gray-400 uppercase tracking-wider border-b border-gray-700">
        <tr>
          <th class="text-left py-2">Price</th>
          <th class="text-left py-2">Qty</th>
        </tr>
      </thead>
      <tbody>
        {#each asks as level}
          <tr class="hover:bg-red-950 transition relative">
            <td class="py-1 text-red-300">{level.price.toFixed(2)}</td>
            <td class="py-1 relative">
              <div
                class="absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-500/5 rounded"
                style="width: {(level.quantity / maxAskQuantity) * 100}%"
              />
              <span class="relative z-10">{level.quantity.toFixed(2)}</span>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
