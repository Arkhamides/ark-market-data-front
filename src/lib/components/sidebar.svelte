<script lang="ts">
    import {
        PanelLeftClose,
        PanelRightClose,
        Home,
        Briefcase,
        Settings,
        Users,
        LogOut
    } from "lucide-svelte";

    let isCollapsed = false;
</script>

<div class="flex h-screen overflow-hidden">
    <!-- Sidebar -->
    <nav
        class={`${
            isCollapsed ? "w-14" : "w-64"
        } bg-zinc-50 border-r border-gray-200 p-2 transition-all duration-300 flex flex-col h-[80%] overflow-hidden`}
    >
        <!-- Toggle Button -->
        <button
            on:click={() => (isCollapsed = !isCollapsed)}
            class={`${isCollapsed ? "" : "self-end"}` +
                " mb-6 text-gray-500 hover:text-black"}
        >
            {#if isCollapsed}
                <PanelRightClose class="w-6 h-6" />
            {:else}
                <PanelLeftClose class="w-6 h-6" />
            {/if}
        </button>

        <a
            href="/home"
            class="flex items-center gap-3 mt-4 text-gray-700 hover:text-black font-medium"
        >
            <Home class="w-5 h-5" />
            <span class={`${isCollapsed ? "sr-only" : ""}`}>Home</span>
        </a>
        <a
            href="/connections"
            class="flex items-center gap-3 text-gray-700 hover:text-black font-medium"
        >
            <Users class="w-5 h-5" />
            <span class={`${isCollapsed ? "sr-only" : ""}`}>Connections</span>
        </a>
        <a
            href="/settings"
            class="flex items-center gap-3 text-gray-700 hover:text-black font-medium"
        >
            <Settings class="w-5 h-5" />
            <span class={`${isCollapsed ? "sr-only" : ""}`}>Settings</span>
        </a>
        <a
            href="/logout"
            class="flex items-center gap-3 mt-auto text-red-500 hover:text-red-600 font-medium"
        >
            <LogOut class="w-5 h-5" />
            <span class={`${isCollapsed ? "sr-only" : ""}`}>Logout</span>
        </a>
    </nav>
</div>
