<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { browser } from "$app/environment";
    import { Home, Users, Search, Building2, LogOut } from "lucide-svelte";
    let showDropdown = false;
    let showMeDropdown = false;

    let meDropdownRef: HTMLElement;
    let orgDropdownRef: HTMLElement;

    function handleClickOutside(event: MouseEvent) {
        if (
            showMeDropdown &&
            meDropdownRef &&
            !meDropdownRef.contains(event.target as Node)
        ) {
            showMeDropdown = false;
        }

        if (
            showDropdown &&
            orgDropdownRef &&
            !orgDropdownRef.contains(event.target as Node)
        ) {
            showDropdown = false;
        }
    }

    onMount(() => {
        document.addEventListener("click", handleClickOutside);
    });

    export let avatarUrl: string;
    export let username: string;
</script>

<header class="bg-white border-b shadow-sm fixed top-0 inset-x-0 z-50">
    <div
        class="max-w-screen-xl mx-auto px-4 flex items-center justify-between h-16"
    >
        <!-- Logo -->
        <div class="flex items-center space-x-4">
            <a href="/home" class="flex items-center space-x-2">
                <img src="/og.png" alt="Logo" class="h-10 w-auto" />
            </a>
            <input
                type="text"
                placeholder="Search"
                class="hidden md:block bg-gray-100 border rounded-md px-3 py-1 text-sm focus:outline-none focus:ring"
            />
            <!-- Search icon (visible on small screens only) -->
            <button
                class="block md:hidden text-gray-700 hover:text-blue-600"
                on:click={() => {
                    /* trigger mobile search logic */
                }}
                aria-label="Open search"
            >
                <Search class="w-5 h-5" />
            </button>
        </div>

        <!-- Navigation Items -->
        <nav class="flex items-center space-x-6 text-sm text-gray-700">
            <a
                href="/home"
                class="flex flex-col items-center space-y-0.5 hover:text-blue-600"
            >
                <Home class="w-5 h-5" />
                <span class="text-xs">Home</span>
            </a>

            <a
                href="/connections"
                class="flex flex-col items-center space-y-0.5 hover:text-blue-600"
            >
                <Users class="w-5 h-5" />
                <span class="text-xs">My Network</span>
            </a>

            <!-- Dropdowns -->
            <div class="relative" bind:this={meDropdownRef}>
                <button
                    on:click={() => (showMeDropdown = !showMeDropdown)}
                    class="flex flex-col items-center space-y-0.5 hover:text-blue-600"
                >
                    <img
                        src={avatarUrl || "https://i.pravatar.cc/80?img=12"}
                        alt="User"
                        class="w-5 h-5 rounded-full"
                    />
                    <div class="flex items-center text-xs space-x-0.5">
                        <span>Me</span>
                        <svg
                            class="w-3 h-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M5 7l5 5 5-5H5z" />
                        </svg>
                    </div>
                </button>

                {#if showMeDropdown}
                    <div
                        class="absolute top-full right-0 mt-2 w-48 bg-white border rounded shadow-md z-50 p-3"
                    >
                        <div class="flex items-center space-x-3 mb-3">
                            <img
                                src={avatarUrl ||
                                    "https://i.pravatar.cc/80?img=12"}
                                alt="Profile"
                                class="w-10 h-10 rounded-full"
                            />
                            <div>
                                <p class="text-sm font-medium">
                                    {username || "Anonymous"}
                                </p>
                                <p class="text-xs text-gray-500">
                                    Product Designer
                                </p>
                            </div>
                        </div>
                        <a
                            href="/profile"
                            class="block text-sm text-gray-700 hover:bg-gray-100 px-3 py-1 rounded"
                        >
                            View Profile
                        </a>
                        <a
                            href="/settings"
                            class="block text-sm text-gray-700 hover:bg-gray-100 px-3 py-1 rounded"
                        >
                            Settings
                        </a>
                        <a
                            href="/logout"
                            class="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded"
                        >
                            <LogOut class="w-4 h-4" />
                            <span>Logout</span>
                        </a>
                    </div>
                {/if}
            </div>

            <div class="relative" bind:this={orgDropdownRef}>
                <button
                    on:click={() => (showDropdown = !showDropdown)}
                    class="flex flex-col items-center space-y-0.5 hover:text-blue-600"
                >
                    <Building2 class="w-5 h-5" />
                    <div class="flex items-center text-xs space-x-0.5">
                        <span>Organizations</span>
                        <svg
                            class="w-3 h-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M5 7l5 5 5-5H5z" />
                        </svg>
                    </div>
                </button>

                {#if showDropdown}
                    <div
                        class="absolute top-full mt-2 w-40 bg-white border rounded shadow-md py-2 z-50"
                    >
                        <a
                            href="/home"
                            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            Discover
                        </a>
                        <a
                            href="/my-organizations"
                            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            My Organizations
                        </a>
                    </div>
                {/if}
            </div>
        </nav>
    </div>
</header>
