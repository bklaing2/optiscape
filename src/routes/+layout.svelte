<script lang="ts">
	import type { LayoutProps } from './$types';
	import '../app.css';
	import './styles.css';
	import Header from './Header.svelte';
	import Footer from './Footer.svelte';

	let { children }: LayoutProps = $props();
</script>

<div
	class="grid grid-rows-[min-content_minmax(min-content,1fr)_min-content] grid-cols-1 gap-8 pb-16 h-full max-w-4xl mx-auto"
>
	<Header />

	<main class="w-full flex flex-col px-4 box-border">{@render children?.()}</main>

	<Footer signedIn={false} />
</div>
