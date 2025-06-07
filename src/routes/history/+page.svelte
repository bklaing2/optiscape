<script lang="ts">
	import type { PageProps } from './$types';
	import BookList from '$lib/book/List.svelte';

	let { data }: PageProps = $props();
	let { history } = $derived(data);
</script>

<h1>Optiscape books</h1>
<BookList books={history} height={180} className="col-span-full" />
