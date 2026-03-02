<script>
  import { goto } from "$app/navigation";
</script>

<nav class="bg-white px-4 lg:px-6 py-4 flex justify-between items-center">
  <!-- Brand -->
  <div class="flex items-center space-x-4">
    <img src="/og.png" alt="Decentralize Work Logo" class="h-12" />
    <span class="text-2xl font-semibold text-black tracking-tight">
      Decentralize Work
    </span>
  </div>

  <!-- Login Text -->
  <button
    on:click={() => goto("/login")}
    class="text-xl font-semibold text-black hover:underline"
  >
    Login
  </button>
</nav>
