function sortNotes(notes: Note[]) {
	return notes.toSorted((a, b) => {
		if (a.isPinned !== b.isPinned) return Number(b.isPinned) - Number(a.isPinned);
		return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
	});
}

class NotesStore {
	notes = $state<Note[]>([]);
	loading = $state(false);
	error = $state('');
	#requestNumber = 0;

	async refresh() {
		const currentRequest = ++this.#requestNumber;
		this.loading = true;
		this.error = '';

		try {
			if (!window.desktop?.notes) throw new Error('Notes are available in the desktop app.');
			const notes = await window.desktop.notes.list();
			if (currentRequest === this.#requestNumber) this.notes = sortNotes(notes);
		} catch (error) {
			if (currentRequest !== this.#requestNumber) return;
			this.error = error instanceof Error ? error.message : 'Could not load notes.';
		} finally {
			if (currentRequest === this.#requestNumber) this.loading = false;
		}
	}

	upsert(note: Note) {
		this.notes = sortNotes([...this.notes.filter((current) => current.id !== note.id), note]);
	}

	remove(id: string) {
		this.notes = this.notes.filter((note) => note.id !== id);
	}
}

export const notesStore = new NotesStore();
