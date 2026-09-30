<script lang="ts">
	import FileTextIcon from '@lucide/svelte/icons/file-text';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Empty from '$lib/components/ui/empty/index.js';

	interface Props {
		title: string;
		description: string;
		actionLabel?: string;
		onaction?: () => void;
	}

	let { title, description, actionLabel, onaction }: Props = $props();
</script>

<Empty.Root class="min-h-[60vh]">
	<Empty.Header>
		<Empty.Media variant="icon"><FileTextIcon /></Empty.Media>
		<Empty.Title>{title}</Empty.Title>
		<Empty.Description>{description}</Empty.Description>
	</Empty.Header>
	{#if actionLabel && onaction}
		<Empty.Content>
			<Button variant="outline" size="sm" onclick={onaction}>{actionLabel}</Button>
		</Empty.Content>
	{/if}
</Empty.Root>
