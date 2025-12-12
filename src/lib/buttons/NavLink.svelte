<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';

	interface Props {
		href: string;
		hidden?: boolean;
		active?: boolean | undefined;
		children: Snippet;
	}

	let { href, hidden = false, active = undefined, children }: Props = $props();
	let isActive = $derived(active !== undefined ? active : page.url.pathname === href);
</script>

<li class="contents" aria-current={active ? 'page' : undefined}>
	<a
		{href}
		data-sveltekit-noscroll
		class="rounded-full border px-5 py-2 text-nowrap hover:text-amber-900 {isActive
			? 'border-amber-900/20  bg-orange-200/30'
			: 'border-transparent'}  {hidden ? 'hidden' : ''}"
	>
		{@render children()}
	</a>
</li>
