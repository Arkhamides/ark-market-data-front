<script lang="ts">
    import { marked } from "marked";
    import { Eye, Pencil } from "lucide-svelte";
    import { onMount } from "svelte";

    export let markdownInput: string | null;
    export let organizationId: string;
    export let isOwner: boolean;

    markdownInput = markdownInput || "";

    let showPreview = true;
    let originalInput = "";
    let hasChanges = false;

    onMount(() => {
        originalInput = markdownInput || "";
    });

    $: renderedHTML = marked.parse(markdownInput || "");
    $: hasChanges = markdownInput !== originalInput;

    async function saveMarkdown() {
        if (!markdownInput) return;

        const response = await fetch("/api/organization", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                markdown: markdownInput,
                organizationId: organizationId,
            }),
        });

        if (response.ok) {
            originalInput = markdownInput; // reset change flag
            hasChanges = false;
            // Optionally show a toast or navigate
        } else {
            console.error("Failed to save organization details");
        }
    }
</script>

<section class="max-w-5xl mx-auto px-4 sm:px-8 py-6">
    <div class="flex items-center justify-between mb-4">
        <h2 class="text-2xl font-bold text-gray-800">Details</h2>

        {#if isOwner}
            <button
                class="inline-flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full shadow transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                on:click={() => (showPreview = !showPreview)}
                aria-label={showPreview ? "Edit" : "Preview"}
            >
                {#if showPreview}
                    <Pencil class="w-5 h-5" />
                {:else}
                    <Eye class="w-5 h-5" />
                {/if}
            </button>
        {/if}
    </div>

    <!-- Markdown Content Area -->
    <div
        class="rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm mb-4"
    >
        {#if showPreview}
            <div class="prose prose-lg max-w-none p-6">
                {@html renderedHTML}
            </div>
        {:else}
            <textarea
                bind:value={markdownInput}
                class="w-full min-h-[250px] p-6 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 resize-none"
                placeholder="Write your Markdown here..."
            />
        {/if}
    </div>

    {#if hasChanges}
        <div class="text-right">
            <button
                class="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                on:click={saveMarkdown}
            >
                💾 Save
            </button>
        </div>
    {/if}
</section>
