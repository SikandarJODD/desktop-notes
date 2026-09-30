<script lang="ts">
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
</script>

<div class="mx-auto flex w-full max-w-prose flex-col gap-5 px-6 py-8" aria-label="Loading note">
	<div class="flex items-start justify-between gap-4">
		<div class="w-full max-w-sm space-y-2">
			<Skeleton class="h-6 w-2/3" />
			<Skeleton class="h-3 w-36" />
		</div>
		<Skeleton class="h-7 w-28" />
	</div>
	<Skeleton class="h-px w-full" />
	<div class="space-y-2">
		<Skeleton class="h-4 w-full" />
		<Skeleton class="h-4 w-11/12" />
		<Skeleton class="h-4 w-3/4" />
	</div>
</div>
