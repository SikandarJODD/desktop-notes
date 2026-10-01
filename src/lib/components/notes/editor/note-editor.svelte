<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import { cmdOrCtrl, isMac } from '$lib/hooks/is-mac.svelte.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Kbd, KbdGroup } from '$lib/components/ui/kbd/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { Spinner } from '$lib/components/ui/spinner/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { registerPendingNoteSave } from '$lib/notes/pending-note-save.js';
	import { PressedKeys, useDebounce, watch } from 'runed';
	import TagInput from './tag-input.svelte';

	interface Props {
		note?: Note;
		submitting?: boolean;
		saving?: boolean;
		error?: string;
		onsubmit: (input: NoteInput) => void | Promise<void>;
		onautosave?: (input: NoteInput) => void | Promise<void>;
		oncancel: () => void;
	}

	let {
		note,
		submitting = false,
		saving = false,
		error,
		onsubmit,
		onautosave,
		oncancel
	}: Props = $props();
	let title = $state(untrack(() => note?.title ?? ''));
	let content = $state(untrack(() => note?.content ?? ''));
	let tags = $state<string[]>(untrack(() => [...(note?.tags ?? [])]));
	let titleInput = $state<HTMLInputElement | null>(null);
	const isPinned = untrack(() => note?.isPinned ?? false);
	const pressedKeys = new PressedKeys();
	let saveFailed = false;
	let saveQueue: Promise<void> = Promise.resolve();

	function getInput(): NoteInput {
		return {
			title: title.trim(),
			content,
			tags: [...tags],
			isPinned
		};
	}

	function queueSave(callback: (input: NoteInput) => void | Promise<void>, input: NoteInput) {
		const save = saveQueue.then(() => callback(input));
		saveQueue = save.then(
			() => {
				saveFailed = false;
			},
			() => {
				saveFailed = true;
			}
		);
		return save;
	}

	const debouncedSave = useDebounce((input: NoteInput) => {
		if (!onautosave) return;
		return queueSave(onautosave, input);
	}, 750);

	async function flushAutoSave() {
		try {
			await debouncedSave.runScheduledNow();
		} catch {
			// Retry below using the latest editor values.
		}
		await saveQueue;
		if (saveFailed && onautosave) await queueSave(onautosave, getInput());
	}

	onMount(() => {
		if (!note) titleInput?.focus();
		if (onautosave) return registerPendingNoteSave(flushAutoSave);
	});

	watch(
		[() => title, () => content, () => tags],
		() => {
			if (onautosave) {
				void debouncedSave(getInput()).catch(() => undefined);
			}
		},
		{ lazy: true }
	);

	async function saveNote() {
		if (submitting) return;
		await debouncedSave.cancel();
		try {
			await queueSave(onsubmit, getInput());
		} catch {
			// The route keeps the editor open and displays the save error.
		}
	}

	async function finishEditing() {
		if (submitting) return;
		try {
			await flushAutoSave();
			oncancel();
		} catch {
			// Keep the editor open so the user can retry.
		}
	}

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		void saveNote();
	}

	function preventBrowserSave(event: KeyboardEvent) {
		const usesSaveShortcut =
			event.key.toLowerCase() === 's' && (isMac ? event.metaKey : event.ctrlKey);
		if (usesSaveShortcut) event.preventDefault();
	}

	pressedKeys.onKeys([isMac ? 'meta' : 'control', 's'], () => void saveNote());
</script>

<svelte:window onkeydown={preventBrowserSave} />

<form class="mx-auto flex w-full max-w-prose flex-col gap-5 px-6 py-8" onsubmit={handleSubmit}>
	<header class="flex items-center justify-between gap-4">
		<div class="flex min-w-0 flex-1 items-center gap-2">
			<Input
				bind:ref={titleInput}
				bind:value={title}
				placeholder="Untitled"
				aria-label="Note title"
				class="h-auto border-0 px-0 py-1 text-xl leading-tight font-medium tracking-tight shadow-none focus-visible:ring-0"
				disabled={submitting}
			/>
			{#if saving}
				<Spinner class="size-3.5 shrink-0 text-muted-foreground/60" aria-label="Saving note" />
			{/if}
		</div>
		<div class="flex shrink-0 items-center gap-1">
			<Button variant="secondary" onclick={() => void finishEditing()} disabled={submitting}>
				{note ? 'Done' : 'Cancel'}
			</Button>
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
