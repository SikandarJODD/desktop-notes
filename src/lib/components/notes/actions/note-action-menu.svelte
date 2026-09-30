<script lang="ts">
	import EllipsisIcon from '@lucide/svelte/icons/ellipsis';
	import PinIcon from '@lucide/svelte/icons/pin';
	import PinOffIcon from '@lucide/svelte/icons/pin-off';
	import Trash2Icon from '@lucide/svelte/icons/trash-2';
	import { cmdOrCtrl, isMac } from '$lib/hooks/is-mac.svelte.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Kbd, KbdGroup } from '$lib/components/ui/kbd/index.js';
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
	<DropdownMenu.Trigger {disabled} class="cursor-pointer">
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

	<DropdownMenu.Content align="end" class="w-48">
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
		<DropdownMenu.Item
			variant="destructive"
			onclick={ondelete}
			aria-keyshortcuts={isMac ? 'Meta+D' : 'Control+D'}
		>
			<Trash2Icon />
			Delete note
			<DropdownMenu.Shortcut
				class="text-destructive group-hover/dropdown-menu-item:text-destructive group-focus/dropdown-menu-item:text-destructive tracking-normal"
			>
				<KbdGroup>
					<Kbd
						class="bg-destructive/10 text-destructive group-hover/dropdown-menu-item:bg-destructive/20 group-hover/dropdown-menu-item:text-destructive group-focus/dropdown-menu-item:bg-destructive/20 group-focus/dropdown-menu-item:text-destructive dark:bg-destructive/20"
						>{cmdOrCtrl}</Kbd
					>
					<Kbd
						class="bg-destructive/10 text-destructive group-hover/dropdown-menu-item:bg-destructive/20 group-hover/dropdown-menu-item:text-destructive group-focus/dropdown-menu-item:bg-destructive/20 group-focus/dropdown-menu-item:text-destructive dark:bg-destructive/20"
						>D</Kbd
					>
				</KbdGroup>
			</DropdownMenu.Shortcut>
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
