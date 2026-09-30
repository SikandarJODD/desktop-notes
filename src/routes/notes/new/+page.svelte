<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { NoteEditor } from '$lib/components/notes/index.js';
	import { notesStore } from '$lib/notes/notes.svelte.js';

	let submitting = $state(false);
	let error = $state('');

	function getErrorMessage(value: unknown) {
		return value instanceof Error ? value.message : 'Could not create the note.';
	}

	async function createNote(input: NoteInput) {
		submitting = true;
		error = '';

		try {
			if (!window.desktop?.notes) throw new Error('Notes are available in the desktop app.');
			const note = await window.desktop.notes.create(input);
			notesStore.upsert(note);
			await goto(resolve('/notes/[id]', { id: note.id }), { replaceState: true });
		} catch (caughtError) {
			error = getErrorMessage(caughtError);
		} finally {
			submitting = false;
		}
	}
</script>

<svelte:head><title>New note</title></svelte:head>

<NoteEditor {submitting} {error} onsubmit={createNote} oncancel={() => void goto(resolve('/'))} />
