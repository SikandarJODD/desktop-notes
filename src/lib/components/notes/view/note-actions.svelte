<script lang="ts">
	import EllipsisIcon from '@lucide/svelte/icons/ellipsis';
	import PencilIcon from '@lucide/svelte/icons/pencil';
	import PinIcon from '@lucide/svelte/icons/pin';
	import PinOffIcon from '@lucide/svelte/icons/pin-off';
	import Trash2Icon from '@lucide/svelte/icons/trash-2';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';

	interface Props {
		isPinned: boolean;
		disabled?: boolean;
		onedit: () => void;
		ontogglepin: () => void;
		ondelete: () => void;
	}

	let { isPinned, disabled = false, onedit, ontogglepin, ondelete }: Props = $props();
</script>

<div class="flex shrink-0 items-center gap-1">
	<Button variant="ghost" size="sm" onclick={ontogglepin} {disabled}>
		{#if isPinned}
			<PinOffIcon />
			Unpin
		{:else}
			<PinIcon />
			Pin
		{/if}
	</Button>

	<Button variant="outline" size="sm" onclick={onedit} {disabled}>
		<PencilIcon />
		Edit
	</Button>

	<DropdownMenu.Root>
		<DropdownMenu.Trigger {disabled}>
			{#snippet child({ props })}
				<Button variant="ghost" size="icon-sm" aria-label="More note actions" {...props}>
					<EllipsisIcon />
				</Button>
			{/snippet}
		</DropdownMenu.Trigger>
		<DropdownMenu.Content align="end" class="w-36">
			<DropdownMenu.Item variant="destructive" onclick={ondelete}>
				<Trash2Icon />
				Delete note
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</div>
