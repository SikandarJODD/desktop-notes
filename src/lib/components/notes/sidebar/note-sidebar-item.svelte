<script lang="ts">
	import { resolve } from '$app/paths';
	import FileTextIcon from '@lucide/svelte/icons/file-text';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';

	let { note, active = false }: { note: Note; active?: boolean } = $props();
</script>

<Sidebar.MenuItem>
	<Sidebar.MenuButton isActive={active} tooltipContent={note.title.trim() || 'Untitled'}>
		{#snippet child({ props })}
			<a
				href={resolve('/notes/[id]', { id: note.id })}
				aria-current={active ? 'page' : undefined}
				title={note.title.trim() || 'Untitled'}
				{...props}
			>
				<FileTextIcon />
				<span>{note.title.trim() || 'Untitled'}</span>
			</a>
		{/snippet}
	</Sidebar.MenuButton>
</Sidebar.MenuItem>
