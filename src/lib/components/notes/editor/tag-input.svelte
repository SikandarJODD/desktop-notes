<script lang="ts">
	import XIcon from '@lucide/svelte/icons/x';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as InputGroup from '$lib/components/ui/input-group/index.js';

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
	<InputGroup.Root>
		<InputGroup.Input
			{id}
			bind:value={draft}
			{disabled}
			placeholder="Add a tag"
			aria-label="Add a tag"
			class="text-base md:text-sm"
			onkeydown={handleKeydown}
			onblur={addTag}
		/>
		<InputGroup.Addon align="inline-end">
			<InputGroup.Text>Enter to add</InputGroup.Text>
		</InputGroup.Addon>
	</InputGroup.Root>

	{#if value.length > 0}
		<ul class="flex flex-wrap gap-1.5" aria-label="Selected tags">
			{#each value as tag (tag)}
				<li>
					<Badge variant="secondary" class="gap-0.5 pr-0.5">
						{tag}
						<button
							type="button"
							class="ml-0.5 inline-flex size-4 items-center justify-center outline-none hover:bg-foreground/10 focus-visible:ring-1 focus-visible:ring-ring"
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
