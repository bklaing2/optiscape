<script lang="ts">
	import { page } from '$app/state';
	import NavLink from '$lib/buttons/NavLink.svelte';
	import { Button } from '$lib/components/ui/button';
	import MenuIcon from 'virtual:icons/tabler/menu-2';
	import CloseIcon from 'virtual:icons/tabler/x';

	let reading = $derived(page.url.pathname.includes('/read/'));

	function onClick() {
		alert('Menu clicked!');
	}

	let navbarOpen = $state(false);
</script>

<header class="relative mx-6 my-6">
	<a
		href="/"
		class={`absolute left-0 z-0 flex items-center gap-2 overflow-hidden text-xl text-amber-900 transition-[opacity] ${navbarOpen && 'opacity-0'}`}
	>
		<img src="/favicon.png" alt="optiscape icon" class="aspect-square h-8" />
		Optiscape
	</a>

	<div class={`absolute right-0 flex w-full items-center justify-end`}>
		<nav
			class="{`scrollbar-hidden overflow-x-auto transition-[max-width] ${navbarOpen ? 'max-w-96' : 'max-sm:max-w-0'} flex gap-x-1 sm:max-w-96`},"
		>
			<ul class="contents">
				<NavLink href="/">Home</NavLink>
				<NavLink href="/books">Books</NavLink>
				<NavLink href="/edit">Edit</NavLink>
				<NavLink href="/about">About</NavLink>
				<NavLink href="/edit/{page.params.id}" hidden={!reading}>Edit this book!</NavLink>
			</ul>
		</nav>

		<Button
			onclick={() => (navbarOpen = !navbarOpen)}
			class="text-xl text-rose-700 sm:hidden"
			variant="ghost"
		>
			{#if navbarOpen}
				<CloseIcon />
			{:else}
				<MenuIcon />
			{/if}
		</Button>
	</div>
</header>
