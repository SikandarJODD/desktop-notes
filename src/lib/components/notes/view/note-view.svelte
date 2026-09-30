<script lang="ts">
	import { Separator } from '$lib/components/ui/separator/index.js';
	import NoteActions from './note-actions.svelte';
	import NoteContent from './note-content.svelte';
	import NoteMetadata from './note-metadata.svelte';
	import NoteTags from './note-tags.svelte';

	interface Props {
		note: Note;
		busy?: boolean;
		onedit: () => void;
		ontogglepin: () => void;
		ondelete: () => void;
	}

	let { note, busy = false, onedit, ontogglepin, ondelete }: Props = $props();
</script>

<article class="mx-auto flex w-full max-w-prose flex-col gap-5 px-6 py-8">
	<header class="flex items-start justify-between gap-4">
		<div class="min-w-0 space-y-1.5">
			<h1 class="text-xl leading-tight font-semibold tracking-tight text-balance break-words">
				{note.title.trim() || 'Untitled'}
			</h1>
			<NoteMetadata updatedAt={note.updatedAt} />
		</div>
		<NoteActions isPinned={note.isPinned} disabled={busy} {onedit} {ontogglepin} {ondelete} />
	</header>

	<NoteTags tags={note.tags} />
	<Separator />
	<NoteContent content={note.content} />
</article>
