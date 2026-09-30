const { randomUUID } = require('node:crypto');
const { DatabaseSync } = require('node:sqlite');

let database;

function openDatabase(filePath) {
	database = new DatabaseSync(filePath);
	database.exec(`
		CREATE TABLE IF NOT EXISTS notes (
			id TEXT PRIMARY KEY,
			title TEXT NOT NULL DEFAULT '',
			content TEXT NOT NULL DEFAULT '',
			tags TEXT NOT NULL DEFAULT '[]',
			is_pinned INTEGER NOT NULL DEFAULT 0,
			created_at TEXT NOT NULL,
			updated_at TEXT NOT NULL
		);
	`);

	const columns = database.prepare('PRAGMA table_info(notes)').all();
	if (!columns.some((column) => column.name === 'is_pinned')) {
		database.exec('ALTER TABLE notes ADD COLUMN is_pinned INTEGER NOT NULL DEFAULT 0');
	}

	database.exec(`
		CREATE INDEX IF NOT EXISTS idx_notes_pinned_updated_at
		ON notes(is_pinned DESC, updated_at DESC);
	`);
}

function closeDatabase() {
	if (!database) return;

	database.close();
	database = undefined;
}

function getDatabase() {
	if (!database) {
		throw new Error('Database has not been opened');
	}

	return database;
}

function normalizeNoteInput(input) {
	if (!input || typeof input !== 'object' || Array.isArray(input)) {
		throw new TypeError('Note input must be an object');
	}

	if (typeof input.title !== 'string') {
		throw new TypeError('Note title must be a string');
	}

	if (typeof input.content !== 'string') {
		throw new TypeError('Note content must be a string');
	}

	if (!Array.isArray(input.tags) || !input.tags.every((tag) => typeof tag === 'string')) {
		throw new TypeError('Note tags must be an array of strings');
	}

	if (input.isPinned !== undefined && typeof input.isPinned !== 'boolean') {
		throw new TypeError('Note pinned state must be a boolean');
	}

	return {
		title: input.title,
		content: input.content,
		tags: [...new Set(input.tags.map((tag) => tag.trim()).filter(Boolean))],
		isPinned: input.isPinned
	};
}

function mapNote(row) {
	if (!row) return null;

	return {
		id: row.id,
		title: row.title,
		content: row.content,
		tags: JSON.parse(row.tags),
		isPinned: Boolean(row.is_pinned),
		createdAt: row.created_at,
		updatedAt: row.updated_at
	};
}

function listNotes() {
	const rows = getDatabase()
		.prepare(`
			SELECT id, title, content, tags, is_pinned, created_at, updated_at
			FROM notes
			ORDER BY is_pinned DESC, updated_at DESC
		`)
		.all();

	return rows.map(mapNote);
}

function getNote(id) {
	if (typeof id !== 'string' || !id) {
		throw new TypeError('Note id must be a non-empty string');
	}

	const row = getDatabase()
		.prepare(`
			SELECT id, title, content, tags, is_pinned, created_at, updated_at
			FROM notes
			WHERE id = ?
		`)
		.get(id);

	return mapNote(row);
}

function createNote(input) {
	const note = normalizeNoteInput(input);
	const id = randomUUID();
	const now = new Date().toISOString();

	getDatabase()
		.prepare(`
			INSERT INTO notes (id, title, content, tags, is_pinned, created_at, updated_at)
			VALUES (?, ?, ?, ?, ?, ?, ?)
		`)
		.run(id, note.title, note.content, JSON.stringify(note.tags), note.isPinned ? 1 : 0, now, now);

	return getNote(id);
}

function updateNote(id, input) {
	const existingNote = getNote(id);
	if (!existingNote) return null;

	const note = normalizeNoteInput(input);
	const updatedAt = new Date().toISOString();
	const isPinned = note.isPinned ?? existingNote.isPinned;

	getDatabase()
		.prepare(`
			UPDATE notes
			SET title = ?, content = ?, tags = ?, is_pinned = ?, updated_at = ?
			WHERE id = ?
		`)
		.run(note.title, note.content, JSON.stringify(note.tags), isPinned ? 1 : 0, updatedAt, id);

	return getNote(id);
}

function deleteNote(id) {
	if (typeof id !== 'string' || !id) {
		throw new TypeError('Note id must be a non-empty string');
	}

	const result = getDatabase().prepare('DELETE FROM notes WHERE id = ?').run(id);
	return Number(result.changes) > 0;
}

module.exports = {
	openDatabase,
	closeDatabase,
	listNotes,
	getNote,
	createNote,
	updateNote,
	deleteNote
};
