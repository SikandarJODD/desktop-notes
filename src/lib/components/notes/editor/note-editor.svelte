<script lang="ts">
	import { untrack } from 'svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import TagInput from './tag-input.svelte';

	interface Props {
		note?: Note;
		submitting?: boolean;
		error?: string;
		onsubmit: (input: NoteInput) => void | Promise<void>;
		oncancel: () => void;
	}

	let { note, submitting = false, error, onsubmit, oncancel }: Props = $props();
	let title = $state(untrack(() => note?.title ?? ''));
	let content = $state(untrack(() => note?.content ?? ''));
	let tags = $state<string[]>(untrack(() => [...(note?.tags ?? [])]));

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		void onsubmit({
			title: title.trim(),
			content,
			tags,
			isPinned: note?.isPinned ?? false
		});
	}
</script>

<form class="mx-auto flex w-full max-w-prose flex-col gap-5 px-6 py-8" onsubmit={handleSubmit}>
	<header class="flex items-start justify-between gap-4">
		<Input
			bind:value={title}
			placeholder="Untitled"
			aria-label="Note title"
			class="h-auto border-0 px-0 py-1 text-xl leading-tight font-semibold tracking-tight shadow-none focus-visible:ring-0"
			disabled={submitting}
		/>
		<div class="flex shrink-0 items-center gap-1">
			<Button variant="ghost" size="sm" onclick={oncancel} disabled={submitting}>Cancel</Button>
			<Button type="submit" size="sm" disabled={submitting}>
				{submitting ? 'Saving…' : 'Save'}
			</Button>
		</div>
	</header>

	<div class="space-y-2">
		<label for="note-tags" class="text-xs font-medium">Tags</label>
		<TagInput id="note-tags" bind:value={tags} disabled={submitting} />
	</div>

	<Separator />

	<label for="note-content" class="sr-only">Note content</label>
	<Textarea
		id="note-content"
		bind:value={content}
		placeholder="Start writing…"
		class="min-h-[55vh] resize-none border-0 px-0 text-base leading-relaxed shadow-none focus-visible:ring-0"
		disabled={submitting}
	/>

	{#if error}
		<p class="text-sm text-destructive" role="alert">{error}</p>
	{/if}
</form>
