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
