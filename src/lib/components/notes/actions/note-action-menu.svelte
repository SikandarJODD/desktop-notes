<script lang="ts">
	import EllipsisIcon from '@lucide/svelte/icons/ellipsis';
	import PinIcon from '@lucide/svelte/icons/pin';
	import PinOffIcon from '@lucide/svelte/icons/pin-off';
	import Trash2Icon from '@lucide/svelte/icons/trash-2';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';

	interface Props {
		isPinned: boolean;
		disabled?: boolean;
		sidebar?: boolean;
		ontogglepin: () => void;
		ondelete: () => void;
	}

	let { isPinned, disabled = false, sidebar = false, ontogglepin, ondelete }: Props = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger {disabled}>
		{#snippet child({ props })}
			{#if sidebar}
				<Sidebar.MenuAction showOnHover aria-label="More note actions" {disabled} {...props}>
					<EllipsisIcon />
				</Sidebar.MenuAction>
			{:else}
				<Button variant="ghost" size="icon-sm" aria-label="More note actions" {disabled} {...props}>
					<EllipsisIcon />
				</Button>
			{/if}
		{/snippet}
	</DropdownMenu.Trigger>

	<DropdownMenu.Content align="end" class="w-36">
		<DropdownMenu.Item onclick={ontogglepin}>
			{#if isPinned}
				<PinOffIcon />
				Unpin
			{:else}
				<PinIcon />
				Pin
			{/if}
		</DropdownMenu.Item>
		<DropdownMenu.Separator />
		<DropdownMenu.Item variant="destructive" onclick={ondelete}>
			<Trash2Icon />
			Delete note
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
