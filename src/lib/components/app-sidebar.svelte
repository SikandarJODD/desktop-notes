<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import { NoteSidebarSection } from '$lib/components/notes/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { notesStore } from '$lib/notes/notes.svelte.js';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();

	const pinnedNotes = $derived(notesStore.notes.filter((note) => note.isPinned));
	const recentNotes = $derived(notesStore.notes.filter((note) => !note.isPinned));
	const activeNoteId = $derived(page.params.id);

	onMount(() => {
		void notesStore.refresh();
	});
</script>

<Sidebar.Root bind:ref variant="inset" {...restProps}>
	<Sidebar.Header>
		<div class="flex h-7 items-center px-2">
			<span class="text-sm font-semibold tracking-tight">Notes</span>
		</div>
		<Button href={resolve('/notes/new')} class="w-full justify-start" size="sm">
			<!-- <PlusIcon /> -->
			New note
		</Button>
	</Sidebar.Header>

	<!-- <Sidebar.Separator /> -->

	<Sidebar.Content>
		{#if pinnedNotes.length > 0}
			<NoteSidebarSection title="Pinned" notes={pinnedNotes} {activeNoteId} />
		{/if}

		<NoteSidebarSection
			title="Recent notes"
			notes={recentNotes}
			{activeNoteId}
			loading={notesStore.loading && notesStore.notes.length === 0}
		/>

		{#if notesStore.error}
			<div class="space-y-2 px-4 py-2">
				<p class="text-xs text-destructive" role="alert">{notesStore.error}</p>
				<Button variant="outline" size="xs" onclick={() => void notesStore.refresh()}>
					Try again
				</Button>
			</div>
		{/if}
	</Sidebar.Content>

	<Sidebar.Rail />
</Sidebar.Root>
