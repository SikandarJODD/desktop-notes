<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { cmdOrCtrl, isMac } from '$lib/hooks/is-mac.svelte.js';
	import { NoteSidebarSection } from '$lib/components/notes/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Kbd, KbdGroup } from '$lib/components/ui/kbd/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { toPlainNoteInput } from '$lib/notes/note-input.js';
	import { notesStore } from '$lib/notes/notes.svelte.js';
	import { PressedKeys } from 'runed';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();
	let busyNoteId = $state<string | null>(null);
	let actionError = $state('');
	const pressedKeys = new PressedKeys();

	const pinnedNotes = $derived(notesStore.notes.filter((note) => note.isPinned));
	const recentNotes = $derived(notesStore.notes.filter((note) => !note.isPinned));
	const activeNoteId = $derived(page.params.id);

	onMount(() => {
		void notesStore.refresh();
	});

	function getErrorMessage(error: unknown, fallback: string) {
		return error instanceof Error ? error.message : fallback;
	}

	function openNewNote() {
		void goto(resolve('/notes/new'));
	}

	function preventBrowserNewWindow(event: KeyboardEvent) {
		const usesNewNoteShortcut =
			event.key.toLowerCase() === 'n' && (isMac ? event.metaKey : event.ctrlKey);
		if (usesNewNoteShortcut) event.preventDefault();
	}

	async function togglePin(note: Note) {
		busyNoteId = note.id;
		actionError = '';

		try {
			if (!window.desktop?.notes) throw new Error('Notes are available in the desktop app.');
			const updatedNote = await window.desktop.notes.update(
				note.id,
				toPlainNoteInput({
					title: note.title,
					content: note.content,
					tags: note.tags,
					isPinned: !note.isPinned
				})
			);
			if (!updatedNote) throw new Error('This note no longer exists.');
			notesStore.upsert(updatedNote);
		} catch (error) {
			actionError = getErrorMessage(error, 'Could not update this note.');
		} finally {
			busyNoteId = null;
		}
	}

	async function deleteNote(note: Note) {
		if (!globalThis.confirm('Delete this note? This cannot be undone.')) return;
		busyNoteId = note.id;
		actionError = '';

		try {
			if (!window.desktop?.notes) throw new Error('Notes are available in the desktop app.');
			const deleted = await window.desktop.notes.delete(note.id);
			if (!deleted) throw new Error('This note no longer exists.');
			notesStore.remove(note.id);
			if (activeNoteId === note.id) await goto(resolve('/'));
		} catch (error) {
			actionError = getErrorMessage(error, 'Could not delete this note.');
		} finally {
			busyNoteId = null;
		}
	}

	pressedKeys.onKeys([isMac ? 'meta' : 'control', 'n'], openNewNote);
</script>

<svelte:window onkeydown={preventBrowserNewWindow} />

<Sidebar.Root bind:ref variant="inset" {...restProps}>
	<Sidebar.Header>
		<div class="flex h-7 items-center px-2">
			<span class="text-sm font-semibold tracking-tight">Notes</span>
		</div>
		<Button
			href={resolve('/notes/new')}
			class="w-full justify-between pr-1.5"
			aria-keyshortcuts={isMac ? 'Meta+N' : 'Control+N'}
		>
			<!-- <PlusIcon /> -->
			New note
			<KbdGroup>
				<Kbd class="bg-primary-foreground/15 text-[10px] text-primary-foreground">{cmdOrCtrl}</Kbd>
				<Kbd class="bg-primary-foreground/15 text-[10px] text-primary-foreground">N</Kbd>
			</KbdGroup>
		</Button>
	</Sidebar.Header>

	<!-- <Sidebar.Separator /> -->

	<Sidebar.Content>
		{#if pinnedNotes.length > 0}
			<NoteSidebarSection
				title="Pinned"
				notes={pinnedNotes}
				{activeNoteId}
				disabledNoteId={busyNoteId}
				ontogglepin={togglePin}
				ondelete={deleteNote}
			/>
		{/if}

		<NoteSidebarSection
			title="Recent notes"
			notes={recentNotes}
			{activeNoteId}
			loading={notesStore.loading && notesStore.notes.length === 0}
			disabledNoteId={busyNoteId}
			ontogglepin={togglePin}
			ondelete={deleteNote}
		/>

		{#if actionError}
			<p class="px-4 py-2 text-xs text-destructive" role="alert">{actionError}</p>
		{/if}

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
