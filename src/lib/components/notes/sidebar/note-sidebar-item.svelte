<script lang="ts">
	import { resolve } from '$app/paths';
	import FileTextIcon from '@lucide/svelte/icons/file-text';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import NoteActionMenu from '../actions/note-action-menu.svelte';

	interface Props {
		note: Note;
		active?: boolean;
		disabled?: boolean;
		ontogglepin: (note: Note) => void;
		ondelete: (note: Note) => void;
	}

	let { note, active = false, disabled = false, ontogglepin, ondelete }: Props = $props();
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
				<FileTextIcon strokeWidth={1.4} />
				<span>{note.title.trim() || 'Untitled'}</span>
			</a>
		{/snippet}
	</Sidebar.MenuButton>
	<NoteActionMenu
		isPinned={note.isPinned}
		{disabled}
		sidebar
		ontogglepin={() => ontogglepin(note)}
		ondelete={() => ondelete(note)}
	/>
</Sidebar.MenuItem>
