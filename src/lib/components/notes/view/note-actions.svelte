<script lang="ts">
	import PencilIcon from '@lucide/svelte/icons/pencil';
	import { Button } from '$lib/components/ui/button/index.js';
	import NoteActionMenu from '../actions/note-action-menu.svelte';

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
	<Button variant="outline" size="sm" onclick={onedit} {disabled}>
		<PencilIcon />
		Edit
	</Button>
	<NoteActionMenu {isPinned} {disabled} {ontogglepin} {ondelete} />
</div>
