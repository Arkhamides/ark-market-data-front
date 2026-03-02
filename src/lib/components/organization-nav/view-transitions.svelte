<script lang="ts">
    import { onMount } from "svelte";
    import Flow from "$lib/components/flow.svelte";
    import Polls from "./polls.svelte";
    import Tasks from "./tasks.svelte";
    import MarkedDown from "./marked-down.svelte";
    import Overview from "./overview.svelte";

    let allLinks: NodeListOf<HTMLAnchorElement>;
    let activeNav = 1;

    export let isOwner;
    export let organization;
    export let polls;
    export let tasks;
    export let discussions;

    onMount(async () => {
        allLinks = document.querySelectorAll(".organization-nav");
        allLinks.forEach((link, i) => {
            link.addEventListener("click", (event: MouseEvent) => {
                event.preventDefault();
                const idx = i + 1;
                if (!document.startViewTransition) {
                    activate(idx);
                    return;
                }
                document.startViewTransition(() => activate(idx));
            });
        });
    });

    function activate(idx: number) {
        activeNav = idx;
        allLinks.forEach((link) => link.classList.remove("active"));
        allLinks[idx - 1].classList.add("active");
        activeNav = activeNav;
    }
</script>

<main class="space-y-8">
    <!-- NAV BAR -->
    <nav>
        <a
            href="#overview"
            class="organization-nav active"
            style="view-transition-name: nav-1;">Overview</a
        >
        <a
            href="#polls"
            class="organization-nav"
            style="view-transition-name: nav-2;">Polls</a
        >
        <a
            href="#tasks"
            class="organization-nav"
            style="view-transition-name: nav-3;">Tasks</a
        >
        <a
            href="#departments"
            class="organization-nav hidden"
            style="view-transition-name: nav-4;">Departments</a
        >
        <a
            href="#discussions"
            class="organization-nav"
            style="view-transition-name: nav-5;">Discussions</a
        >
        <a
            href="#details"
            class="organization-nav"
            style="view-transition-name: nav-6;">Details</a
        >
    </nav>

    {#if activeNav === 1}
        <Overview
            {isOwner}
            title={organization.name}
            subtitle={organization.description}
            image={organization.logo_url}
            overview={organization.overview}
            latestPoll={{
                title: polls[0].title,
                description: polls[0].description,
                voteLink:
                    "/organization/" + organization.id + "/poll/" + polls[0].id,
            }}
            organizationId={organization.id}
        />
    {:else if activeNav === 2}
        <!-- Polls Section -->
        <section id="polls" style="view-transition-name: polls-view ">
            <div class="px-4 sm:px-8 md:px-12 lg:px-64">
                <Polls {polls} organizationId={organization.id} {isOwner} />
            </div>
        </section>
    {:else if activeNav === 3}
        <!-- Tasks Section -->
        <section
            id="tasks"
            style="view-transition-name: tasks-view"
            class="mt-8 px-4 sm:px-8 md:px-12 lg:px-64"
        >
            <Tasks {tasks} organizationId={organization.id} {isOwner} />
        </section>
    {:else if activeNav === 4}
        <!-- Departments Section -->
        <section style="view-transition-name: departments-view px-4 sm:px-8 md:px-12 lg:px-64">
            <h2 class="text-xl font-bold mb-4">Product Flows</h2>
            <Flow />
        </section>
    {:else if activeNav === 5}
        <!-- Discussions Section -->
        <section
            id="discussions"
            style="view-transition-name: discussions-view"
            class="px-4 sm:px-8 md:px-12 lg:px-64"
        >
            <div class="flex items-center gap-4 mb-4">
                <h2 class="text-xl font-bold">Discussions</h2>
                {#if isOwner}
                    <a
                        href={"/organization/" +
                            organization.id +
                            "/add-discussion"}
                        class="px-4 py-2 bg-black text-white rounded hover:bg-blue-700 transition"
                        >Add Discussion</a
                    >
                {/if}
            </div>

            {#if discussions && discussions.length > 0}
                {#each discussions as discussion}
                    <div class="border border-gray-300 rounded p-4 mb-4">
                        <h3 class="text-lg font-bold">
                            {discussion.title}
                        </h3>
                        <p class="text-gray-700 mb-2">
                            {discussion.description}
                        </p>
                        <a
                            href={"/organization/" +
                                organization.id +
                                "/discussions/" +
                                discussion.id}
                            class="px-4 py-2 bg-black text-white rounded hover:bg-blue-700 transition"
                        >
                            View
                        </a>
                    </div>
                {/each}
            {:else}
                <p class="text-gray-600">
                    This section contains discussions related to the
                    organization. No discussions are currently available.
                </p>
            {/if}
        </section>
    {:else}
        <section style="view-transition-name: details-view">
            <MarkedDown
                markdownInput={organization.details}
                organizationId={organization.id}
                {isOwner}
            />
        </section>
    {/if}




</main>

<style>
    section {
        scroll-behavior: smooth;
    }
    nav {
        border-radius: 1.25rem;
        background-color: #111;
        padding: 1rem 1.5rem;
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
    }

    a {
        padding: 0.5rem 1rem;
        position: relative;
        color: white;
        text-decoration: none;
        view-transition-name: nav-item;
        z-index: 1;
    }

    a.active::before {
        content: "";
        position: absolute;
        inset: 0;
        background-image: linear-gradient(to right, #6a11cb, #2575fc);
        z-index: -1;
        border-radius: 0.75rem;
        view-transition-name: active-nav-elem;
    }

    /* View-transition tweaks for the active pill */
    ::view-transition-old(active-nav-elem),
    ::view-transition-new(active-nav-elem) {
        height: 100%;
    }
    ::view-transition-group(active-nav-elem) {
        animation-timing-function: linear;
        animation-duration: 0.4s;
    }
</style>
