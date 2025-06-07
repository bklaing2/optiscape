<script lang="ts">
	import type { LayoutProps } from './$types';
	import { page } from '$app/state';
	import NavLink from '$lib/buttons/NavLink.svelte';

	let { data, children }: LayoutProps = $props();
	let { streamed } = $derived(data);
	let searchParams = $derived(page.url.searchParams);
	let category = $derived(searchParams.get('category'));
	let entry = $derived(searchParams.get('entry'));
	let filter = $derived(searchParams.get('filter'));
</script>

<div
	class="grid grid-rows-[repeat(2,min-content)_1fr] grid-cols-[max-content_1fr] items-start justify-items-center h-full w-full gap-x-4 gap-y-14"
>
	<h1 class="col-span-full">Optiscape books</h1>

	<ul class="flex flex-wrap justify-center gap-x-2 gap-y-1 col-span-full p-1 mx-auto rounded-full">
		<NavLink href="/books" active={!category}>ALL BOOKS</NavLink>
		{#await streamed.categories}
			Loading categories...
		{:then categories}
			{#each categories as c}
				<NavLink href="/books?category={c.id}" active={c.id === category}>{c.text}</NavLink>
			{/each}
		{/await}
	</ul>

	{#await streamed.entries}
		Loading entries...
	{:then entries}
		<ul class="flex flex-col gap-4 max-w-40">
			{#if entries.length > 0}
				<form action="/books" class="contents">
					{#each [...searchParams.entries()].filter(([k]) => k !== 'filter') as [key, value]}
						<input type="hidden" name={key} {value} />
					{/each}
					<input
						type="text"
						name="filter"
						placeholder="Filter"
						value={filter}
						class="bg-orange-200/60 border border-amber-900/0 h-min mb-6 px-8 py-4 rounded-full outline-hidden placeholder:text-slate-600 focus:border-amber-900/20 transition"
					/>
				</form>

				{#each entries as e}
					<NavLink href="/books?category={category}&entry={e.id}" active={e.id === entry}>
						{e.text}
					</NavLink>
				{/each}
			{/if}
		</ul>
	{/await}

	<div class="flex flex-col gap-y-4 items-center w-full">{@render children?.()}</div>
</div>
