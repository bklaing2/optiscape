<script lang="ts">
	import type { Book } from '$lib/types/types';
	import BookView from '$lib/book/Book.svelte';

	interface Props {
		books: Book[];
		edit?: boolean;
		showEditIcon?: boolean;
		height?: number;
		vertical?: boolean;
		className?: string;
	}

	let {
		books,
		edit = false,
		showEditIcon = false,
		height = 200,
		vertical = false,
		className = ''
	}: Props = $props();
</script>

<div
	class="flex items-center gap-4 w-full p-4 container overflow-x-scroll overflow-y-clip
	{className}"
	style:flex-direction={vertical ? 'column' : 'row'}
>
	{#each books as book}
		<BookView {book} {height} {edit} {showEditIcon} />
	{/each}
</div>
