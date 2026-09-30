<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import { cmdOrCtrl, isMac } from '$lib/hooks/is-mac.svelte.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Kbd, KbdGroup } from '$lib/components/ui/kbd/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { PressedKeys } from 'runed';
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
	let titleInput = $state<HTMLInputElement | null>(null);
	const pressedKeys = new PressedKeys();

	onMount(() => {
		if (!note) titleInput?.focus();
	});

	function saveNote() {
		if (submitting) return;
		void onsubmit({
			title: title.trim(),
			content,
			tags: [...tags],
			isPinned: note?.isPinned ?? false
		});
	}

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		saveNote();
	}

	function preventBrowserSave(event: KeyboardEvent) {
		const usesSaveShortcut =
			event.key.toLowerCase() === 's' && (isMac ? event.metaKey : event.ctrlKey);
		if (usesSaveShortcut) event.preventDefault();
	}

	pressedKeys.onKeys([isMac ? 'meta' : 'control', 's'], saveNote);
</script>

<svelte:window onkeydown={preventBrowserSave} />

<form class="mx-auto flex w-full max-w-prose flex-col gap-5 px-6 py-8" onsubmit={handleSubmit}>
	<header class="flex items-center justify-between gap-4">
		<Input
			bind:ref={titleInput}
			bind:value={title}
			placeholder="Untitled"
			aria-label="Note title"
			class="h-auto border-0 px-0 py-1 text-xl leading-tight font-medium tracking-tight shadow-none focus-visible:ring-0"
			disabled={submitting}
		/>
		<div class="flex shrink-0 items-center gap-1">
			<Button variant="secondary" onclick={oncancel} disabled={submitting}>Cancel</Button>
			<Button type="submit" disabled={submitting} class="pr-1.5">
				{submitting ? 'Saving…' : 'Save'}
				{#if !submitting}
					<KbdGroup>
						<Kbd class="bg-primary-foreground/15 text-[10px] text-primary-foreground"
							>{cmdOrCtrl}</Kbd
						>
						<Kbd class="bg-primary-foreground/15 text-[10px] text-primary-foreground">S</Kbd>
					</KbdGroup>
				{/if}
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
