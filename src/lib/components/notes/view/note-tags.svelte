<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';

	let { tags }: { tags: string[] } = $props();
</script>

{#if tags.length > 0}
	<ul class="flex flex-wrap gap-1.5" aria-label="Note tags">
		{#each tags as tag (tag)}
			<li><Badge variant="secondary">{tag}</Badge></li>
		{/each}
	</ul>
{/if}
