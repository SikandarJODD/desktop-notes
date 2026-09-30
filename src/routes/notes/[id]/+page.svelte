<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { NoteEditor, NoteLoading, NoteMessage, NoteView } from '$lib/components/notes/index.js';
	import { isMac } from '$lib/hooks/is-mac.svelte.js';
	import { toPlainNoteInput } from '$lib/notes/note-input.js';
	import { notesStore } from '$lib/notes/notes.svelte.js';
	import { watch } from 'runed';

	type ViewState = 'loading' | 'ready' | 'not-found' | 'error';

	let note = $state<Note | null>(null);
	let viewState = $state<ViewState>('loading');
	let editing = $state(false);
	let busy = $state(false);
	let editorError = $state('');
	let loadError = $state('');
	let requestNumber = 0;

	function getErrorMessage(value: unknown, fallback: string) {
		return value instanceof Error ? value.message : fallback;
	}

	function getNoteInput(currentNote: Note, isPinned = currentNote.isPinned): NoteInput {
		return {
			title: currentNote.title,
			content: currentNote.content,
			tags: currentNote.tags,
			isPinned
		};
	}

	async function loadNote(id: string | undefined) {
		const currentRequest = ++requestNumber;
		viewState = 'loading';
		editing = false;
		loadError = '';
		if (!id) {
			note = null;
			viewState = 'not-found';
			return;
		}

		try {
			if (!window.desktop?.notes) throw new Error('Notes are available in the desktop app.');
			const result = await window.desktop.notes.get(id);
			if (currentRequest !== requestNumber) return;

			note = result;
			viewState = result ? 'ready' : 'not-found';
			if (result) notesStore.upsert(result);
		} catch (caughtError) {
			if (currentRequest !== requestNumber) return;
			loadError = getErrorMessage(caughtError, 'Could not load this note.');
			viewState = 'error';
		}
	}

	async function saveNote(input: NoteInput) {
		if (!note) return;
		busy = true;
		editorError = '';

		try {
			const updatedNote = await window.desktop.notes.update(note.id, toPlainNoteInput(input));
			if (!updatedNote) {
				note = null;
				viewState = 'not-found';
				return;
			}

			note = updatedNote;
			notesStore.upsert(updatedNote);
			editing = false;
		} catch (caughtError) {
			editorError = getErrorMessage(caughtError, 'Could not save this note.');
		} finally {
			busy = false;
		}
	}

	async function togglePin() {
		if (!note) return;
		busy = true;

		try {
			const updatedNote = await window.desktop.notes.update(
				note.id,
				toPlainNoteInput(getNoteInput(note, !note.isPinned))
			);
			if (!updatedNote) {
				note = null;
				viewState = 'not-found';
				return;
			}

			note = updatedNote;
			notesStore.upsert(updatedNote);
		} catch (caughtError) {
			loadError = getErrorMessage(caughtError, 'Could not update this note.');
			viewState = 'error';
		} finally {
			busy = false;
		}
	}

	async function deleteNote() {
		if (!note || !globalThis.confirm('Delete this note? This cannot be undone.')) return;
		busy = true;

		try {
			const deleted = await window.desktop.notes.delete(note.id);
			if (!deleted) throw new Error('This note no longer exists.');
			notesStore.remove(note.id);
			await goto(resolve('/'));
		} catch (caughtError) {
			loadError = getErrorMessage(caughtError, 'Could not delete this note.');
			viewState = 'error';
		} finally {
			busy = false;
		}
	}

	function handleDeleteShortcut(event: KeyboardEvent) {
		const usesDeleteShortcut =
			event.key.toLowerCase() === 'd' && (isMac ? event.metaKey : event.ctrlKey);
		if (!usesDeleteShortcut) return;

		event.preventDefault();
		if (!busy) void deleteNote();
	}

	watch(
		() => page.params.id,
		(id) => void loadNote(id)
	);
</script>

<svelte:window onkeydown={handleDeleteShortcut} />

<svelte:head>
	<title>{note?.title.trim() || 'Note'}</title>
</svelte:head>

{#if viewState === 'loading'}
	<NoteLoading />
{:else if viewState === 'not-found'}
	<NoteMessage
		title="Note not found"
		description="It may have been deleted or moved."
		actionLabel="Back to notes"
		onaction={() => void goto(resolve('/'))}
	/>
{:else if viewState === 'error'}
	<NoteMessage
		title="Could not open note"
		description={loadError}
		actionLabel="Try again"
		onaction={() => void loadNote(page.params.id)}
	/>
{:else if note && editing}
	{#key note.id}
		<NoteEditor
			{note}
			submitting={busy}
			error={editorError}
			onsubmit={saveNote}
			oncancel={() => {
				editing = false;
				editorError = '';
			}}
		/>
	{/key}
{:else if note}
	<NoteView
		{note}
		{busy}
		onedit={() => (editing = true)}
		ontogglepin={() => void togglePin()}
		ondelete={() => void deleteNote()}
	/>
{/if}
