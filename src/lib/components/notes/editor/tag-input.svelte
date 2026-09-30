<script lang="ts">
	import XIcon from '@lucide/svelte/icons/x';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import { fade, scale, slide } from 'svelte/transition';
	import { flip } from 'svelte/animate';

	interface Props {
		id?: string;
		value?: string[];
		disabled?: boolean;
	}

	let { id, value = $bindable([]), disabled = false }: Props = $props();
	let draft = $state('');

	function addTag() {
		const tag = draft.trim().replace(/,+$/, '');
		if (!tag) {
			draft = '';
			return;
		}

		const alreadyExists = value.some(
			(currentTag) => currentTag.toLowerCase() === tag.toLowerCase()
		);
		if (!alreadyExists) value = [...value, tag];
		draft = '';
	}

	function removeTag(tag: string) {
		value = value.filter((currentTag) => currentTag !== tag);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ',') {
			event.preventDefault();
			addTag();
			return;
		}

		if (event.key === 'Backspace' && !draft && value.length > 0) {
			value = value.slice(0, -1);
		}
	}
</script>

<div class="space-y-2">
	<InputGroup.Root
		class="has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-0"
	>
		<InputGroup.Input
			{id}
			bind:value={draft}
			{disabled}
			placeholder="Add a tag"
			aria-label="Add a tag"
			class="text-base focus-visible:ring-0! active:ring-0! md:text-sm"
			onkeydown={handleKeydown}
			onblur={addTag}
		/>
		<InputGroup.Addon align="inline-end">
			<InputGroup.Text class="text-xs!">Enter to add</InputGroup.Text>
		</InputGroup.Addon>
	</InputGroup.Root>

	{#if value.length > 0}
		<ul class="flex flex-wrap gap-1.5" aria-label="Selected tags">
			{#each value as tag (tag)}
				<li in:fade|global={{ duration: 200 }} animate:flip={{ duration: 200 }}>
					<Badge variant="secondary" class="gap-0.5 pr-0.5">
						{tag}
						<button
							type="button"
							class="ml-0.5 inline-flex size-4 cursor-pointer items-center justify-center outline-none"
							aria-label={`Remove ${tag} tag`}
							onclick={() => removeTag(tag)}
							{disabled}
						>
							<XIcon class="size-3" />
						</button>
					</Badge>
				</li>
			{/each}
		</ul>
	{/if}
</div>
