<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { fade, scale, slide } from 'svelte/transition';
	import NoteSidebarItem from './note-sidebar-item.svelte';
	import { flip } from 'svelte/animate';

	interface Props {
		title: string;
		notes: Note[];
		activeNoteId?: string;
		loading?: boolean;
		emptyMessage?: string;
		disabledNoteId?: string | null;
		ontogglepin: (note: Note) => void;
		ondelete: (note: Note) => void;
	}

	let {
		title,
		notes,
		activeNoteId,
		loading = false,
		emptyMessage = 'No notes yet.',
		disabledNoteId,
		ontogglepin,
		ondelete
	}: Props = $props();
</script>

<Sidebar.Group>
	<Sidebar.GroupLabel>{title}</Sidebar.GroupLabel>
	<Sidebar.GroupContent>
		<Sidebar.Menu>
			{#if loading}
				{#each Array(4) as _, index (index)}
					<Sidebar.MenuSkeleton showIcon />
				{/each}
			{:else if notes.length > 0}
				{#each notes as note (note.id)}
					<div in:slide={{ duration: 180 }} out:slide={{ duration: 180 }}>
						<NoteSidebarItem
							{note}
							active={activeNoteId === note.id}
							disabled={disabledNoteId === note.id}
							{ontogglepin}
							{ondelete}
						/>
					</div>
				{/each}
			{:else}
				<li class="px-2 py-1.5 text-xs text-sidebar-foreground/60">{emptyMessage}</li>
			{/if}
		</Sidebar.Menu>
	</Sidebar.GroupContent>
</Sidebar.Group>
