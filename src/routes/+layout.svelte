<script lang="ts">
  import { page } from "$app/stores";
  import { initializeStores } from "@skeletonlabs/skeleton";
  import "../app.css";

  const sidebarRoutes = [
    "/home",
  ];


  initializeStores();
</script>

{#if sidebarRoutes.some((route) => $page.url.pathname.startsWith(route))}
  <div class="mt-16">
    <slot />
  </div>
{:else}
  <slot />
{/if}

{#if $page.url.pathname === "/"}
  <footer class="shadow bg-black">
    <div class="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center">
      <span class="text-sm text-white sm:text-center">
        © 2025 <a href="/" class="hover:underline">Decentralize Work™</a>. All
        Rights Reserved.
      </span>
    </div>
  </footer>
{/if}
