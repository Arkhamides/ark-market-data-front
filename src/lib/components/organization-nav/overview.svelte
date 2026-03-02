<script lang="ts">
    import { placeholder_image, handleImageError } from "$lib/common/utils";
    import { Pencil, Save } from "lucide-svelte";

    let editing = false;
    let fileInput: HTMLInputElement;

    export let isOwner: boolean;
    export let title: string;
    export let subtitle: string;
    export let image: string;
    export let overview: string;
    export let latestPoll;
    export let organizationId;

    const handleUpload = async () => {
        const file = fileInput.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("organization_id", organizationId);

        const res = await fetch("/api/add-organization-logo", {
            method: "POST",
            body: formData,
        });

        if (res.ok) {
            const { url } = await res.json();
            image = url;
        } else {
            console.error("Upload failed");
        }
    };

    function triggerFileInput() {
        fileInput?.click();
    }

    async function handleSave() {
        const formData = new FormData();
        formData.append("name", title);
        formData.append("description", subtitle);
        formData.append("overview", overview);

        const res = await fetch("", {
            method: "POST",
            body: formData,
        });

        if (res.ok) {
            editing = false;
        } else {
            alert("Failed to save changes");
        }
    }
</script>

<div class="p-6">
    <div class="flex gap-6">
        <div class="relative w-32 h-32">
            <button
                type="button"
                class="w-32 h-32 p-0 border-none bg-transparent rounded-lg overflow-hidden cursor-pointer"
                on:click={triggerFileInput}
                aria-label="Upload image"
            >
                <img
                    src={image || placeholder_image}
                    alt={title}
                    class="w-full h-full object-cover"
                    on:error={handleImageError}
                />
            </button>

            <input
                type="file"
                accept="image/*"
                bind:this={fileInput}
                class="hidden"
                on:change={handleUpload}
            />
        </div>

        <div class="flex-1 space-y-4">
            <div class="flex items-center gap-2">
                {#if editing}
                    <input
                        bind:value={title}
                        class="text-3xl font-bold border border-gray-300 px-2 py-1 rounded w-full"
                    />
                {:else}
                    <h1 class="text-3xl font-bold">{title}</h1>
                {/if}

                {#if isOwner}
                    <button
                        on:click={() =>
                            editing ? handleSave() : (editing = true)}
                        class="text-gray-600 hover:text-black transition"
                    >
                        {#if editing}
                            <Save size={20} />
                        {:else}
                            <Pencil size={20} />
                        {/if}
                    </button>
                {/if}
            </div>

            {#if editing}
                <textarea
                    bind:value={subtitle}
                    class="w-full border border-gray-300 rounded p-2"
                />
            {:else}
                <p class="text-gray-700 text-lg">{subtitle}</p>
            {/if}
        </div>
    </div>
</div>

<div class="p-6 flex flex-wrap md:flex-nowrap gap-6">
    <!-- Left: Overview + Timeline -->
    <div class="w-full md:w-2/3 space-y-8">
        <!-- Overview Section -->
        <div class="space-y-2">
            <h2 class="text-2xl font-semibold">Overview</h2>
            {#if editing}
                <textarea
                    bind:value={overview}
                    class="w-full border border-gray-300 rounded p-2"
                />
            {:else}
                <p class="text-gray-700 text-lg">
                    {overview || ""}
                </p>
            {/if}
        </div>

        <!-- Timeline Section -->
        <div class="space-y-4">
            <h2 class="text-2xl font-semibold">Timeline</h2>
            <div class="relative flex items-center justify-between h-24">
                <div
                    class="absolute top-6 left-0 w-full h-0.5 bg-gray-300 z-0"
                ></div>

                <!-- Launch -->
                <div class="flex flex-col items-center z-10">
                    <div class="w-4 h-4 bg-gray-500 rounded-full"></div>
                    <div class="mt-2 text-center text-sm">
                        <div class="font-medium">Launched</div>
                        <div class="text-xs text-gray-500">Q1 2025</div>
                    </div>
                </div>

                <!-- Middle point -->
                <div
                    class="flex flex-col items-center z-10 justify-center pt-2 pb-12"
                >
                    <div class="w-4 h-4 rounded-full bg-gray-500"></div>
                </div>

                <!-- Milestone -->
                <div class="flex flex-col items-center z-10">
                    <div class="w-4 h-4 bg-gray-500 rounded-full"></div>
                    <div class="mt-2 text-center text-sm">
                        <div class="font-medium">Production</div>
                        <div class="text-xs text-gray-500">Q2 2025</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Right: Latest Poll -->
    <div class="w-full md:w-1/3 space-y-2">
        <h2 class="text-2xl font-semibold">Latest Poll</h2>
        <div class="border border-gray-300 rounded p-4">
            <h3 class="text-lg font-bold">
                {latestPoll.title}
            </h3>
            <p class="text-gray-700 mb-2">{latestPoll.description}</p>
            <a
                href={latestPoll.voteLink}
                class="px-4 py-2 bg-black text-white rounded hover:bg-blue-700 transition"
            >
                Vote
            </a>
        </div>
    </div>
</div>
