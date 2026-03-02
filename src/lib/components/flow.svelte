<script lang="ts">
  interface FlowItem {
    title: string
    amount: { value: number; currency: string }
    color: 'blue' | 'red' | 'green'
  }

  // your columns
  const column1: FlowItem[] = [
    { title: "iPhone",        amount: { value: 205_500_000_000, currency: "$" }, color: "blue"  },
    { title: "Mac",           amount: { value: 40_200_000_000,  currency: "$" }, color: "blue"  },
    { title: "iPad",          amount: { value: 29_300_000_000,  currency: "$" }, color: "blue"  },
    { title: "Watch & AirPods", amount:{ value: 41_200_000_000,  currency: "$" }, color: "blue"  }
  ]

  const column2: FlowItem[] = [
    { title: "Products", amount: { value: 316_200_000_000, currency: "$" }, color: "blue" },
    { title: "Services", amount: { value: 78_200_000_000,  currency: "$" }, color: "blue" }
  ]

  const column3: FlowItem[] = [
    { title: "Total Revenue", amount: { value: 394_300_000_000, currency: "$" }, color: "blue" }
  ]

  const column4: FlowItem[] = [
    { title: "Cost of Revenue", amount: { value: 223_500_000_000, currency: "$" }, color: "red"   },
    { title: "Gross Profit",     amount: { value: 170_900_000_000, currency: "$" }, color: "green" }
  ]

  function fmtB(item: FlowItem) {
    return `${item.amount.currency}${(item.amount.value / 1e9).toFixed(1)} B`
  }
</script>

<div class="flex items-center justify-center">
  <div class="w-full max-w-5xl p-8 grid grid-cols-4 gap-8">
    
    <!-- a reusable little grid for each column -->
    {#each [column1, column2, column3, column4] as column, ci}
      <section class="space-y-4">
        <div class="grid grid-cols-2 gap-x-6 gap-y-4 items-center">
          {#each column as item, idx}
            <!-- colored box -->
            <div
              class="rounded-lg p-4 w-36 text-center"
              class:bg-blue-200={item.color === 'blue'}
              class:text-blue-900={item.color === 'blue'}
              class:bg-red-200={item.color === 'red'}
              class:text-red-900={item.color === 'red'}
              class:bg-green-200={item.color === 'green'}
              class:text-green-900={item.color === 'green'}
            >
              <div>{item.title}</div>
              <div class="font-bold mt-1">{fmtB(item)}</div>
            </div>

            <!-- arrow (always its own cell!) -->
            <div class="text-2xl text-gray-500 justify-self-center self-center">→</div>
          {/each}
        </div>
      </section>
    {/each}

  </div>
</div>
