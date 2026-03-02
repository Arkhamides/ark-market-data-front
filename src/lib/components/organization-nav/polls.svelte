<script>
    export let polls;
    export let organizationId;
    export let isOwner;
</script>

<div class="flex items-center gap-4 mb-4">
    <h2 class="text-xl font-bold">Polls</h2>

    {#if isOwner}
        <a
            href={"/organization/" + organizationId + "/add-poll"}
            class="px-4 py-2 bg-black text-white rounded hover:bg-blue-700 transition"
            >Add Poll</a
        >
    {/if}
</div>

{#if polls && polls.length > 0}
    {#each polls as poll}
        <div class="border border-gray-300 rounded p-4 mb-4">
            <h3 class="text-lg font-bold">{poll.title}</h3>
            <p class="text-gray-700 mb-2">{poll.description}</p>
            <a
                href={"/organization/" + organizationId + "/poll/" + poll.id}
                class="px-4 py-2 bg-black text-white rounded hover:bg-blue-700 transition"
            >
                Vote
            </a>
        </div>
    {/each}
{:else}
    <p>No polls available at the moment.</p>
{/if}
