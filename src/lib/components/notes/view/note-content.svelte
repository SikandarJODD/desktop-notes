<script lang="ts">
	let { content }: { content: string } = $props();
</script>

{#if content.trim()}
	<div class="text-base leading-relaxed break-words whitespace-pre-wrap">{content}</div>
{:else}
	<p class="text-sm text-muted-foreground">No content yet.</p>
{/if}
