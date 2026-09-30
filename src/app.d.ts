// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	interface NoteInput {
		title: string;
		content: string;
		tags: string[];
		isPinned?: boolean;
	}

	interface Note extends NoteInput {
		id: string;
		isPinned: boolean;
		createdAt: string;
		updatedAt: string;
	}

	interface Window {
		desktop: {
			getVersion: () => Promise<string>;
			notes: {
				list: () => Promise<Note[]>;
				get: (id: string) => Promise<Note | null>;
				create: (input: NoteInput) => Promise<Note>;
				update: (id: string, input: NoteInput) => Promise<Note | null>;
				delete: (id: string) => Promise<boolean>;
			};
		};
	}

	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
