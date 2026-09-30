export function toPlainNoteInput(input: NoteInput): NoteInput {
	return {
		title: input.title,
		content: input.content,
		tags: [...input.tags],
		...(input.isPinned === undefined ? {} : { isPinned: input.isPinned })
	};
}
