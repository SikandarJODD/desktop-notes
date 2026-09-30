<script lang="ts">
	let { updatedAt }: { updatedAt: string } = $props();

	const formatter = new Intl.DateTimeFormat(undefined, {
		dateStyle: 'medium',
		timeStyle: 'short'
	});

	function formatDate(value: string) {
		const date = new Date(value);
		return Number.isNaN(date.getTime()) ? 'Unknown date' : formatter.format(date);
	}
</script>

<p class="text-xs text-muted-foreground tabular-nums">
	Updated <time datetime={updatedAt}>{formatDate(updatedAt)}</time>
</p>
