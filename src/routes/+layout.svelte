<script lang="ts">
	import { onMount } from 'svelte';
	import { onNavigate } from '$app/navigation';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { flushPendingNoteSave } from '$lib/notes/pending-note-save.js';

	let { children } = $props();

	onNavigate(() => flushPendingNoteSave());

	onMount(() => {
		const desktopApp = window.desktop?.app;
		if (!desktopApp) return;

		return desktopApp.onBeforeClose(async () => {
			try {
				await flushPendingNoteSave();
				desktopApp.closeReady();
			} catch {
				desktopApp.closeCancelled();
			}
		});
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<Sidebar.Provider>
	<AppSidebar />
	<Sidebar.Inset class="min-h-svh overflow-hidden">
		<header class="flex h-10 shrink-0 items-center border-b border-border px-2">
			<Sidebar.Trigger />
		</header>
		<div class="min-h-0 flex-1 overflow-auto">
			{@render children()}
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>
