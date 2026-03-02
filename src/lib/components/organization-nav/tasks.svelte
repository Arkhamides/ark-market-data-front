<script lang="ts">
    export let tasks: any[] = [];
    export let organizationId: string;
    export let isOwner: boolean = false;
</script>

<div class="flex items-center gap-4 mb-4">
    <h2 class="text-xl font-bold">Tasks</h2>
    {#if isOwner}
        <a
            href={"/organization/" + organizationId + "/add-task"}
            class="px-4 py-2 bg-black text-white rounded hover:bg-blue-700 transition"
            >Add Task</a
        >
    {/if}
</div>

{#if tasks?.length}
    <div class="space-y-4">
        {#each tasks as task}
            <div class="border border-gray-300 rounded p-4">
                <h3 class="font-semibold">{task.title}</h3>
                <p>{task.description}</p>
                <a
                    class="btn bg-black text-white"
                    href={`/organization/${organizationId}/tasks/${task.id}`}
                >
                    View Task
                </a>
            </div>
        {/each}
    </div>
{:else}
    <p class="my-4 text-gray-600">No tasks yet.</p>
{/if}
