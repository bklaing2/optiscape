<script lang="ts">
  import type { PageData } from './$types'
  import { page } from '$app/state'
  import BookView from '$lib/book/Book.svelte'

  interface Props {
    data: PageData
  }

  let { data }: Props = $props()
  let { books } = $derived(data)
  let searchParams = $derived(page.url.searchParams)
  let showEditIcon = $derived(searchParams.has('edit'))
  let query = $derived(searchParams.get('query'))
</script>

<form action="/books" class="contents">
  {#each [...searchParams.entries()].filter(([k]) => k !== 'query') as [key, value]}
    <input type="hidden" name={key} {value} />
  {/each}
  <input
    type="text"
    name="query"
    placeholder="Search books"
    value={query}
    class="col-span-full mb-6 h-min rounded-full border border-amber-900/0 bg-orange-200/60 px-8 py-4 outline-hidden transition placeholder:text-slate-600 focus:border-amber-900/20"
  />
</form>

{#await books}
  <span class="col-span-full">Loading books...</span>
{:then books}
  {#each books as book (book.id)}
    <BookView {book} {showEditIcon} class="w-full" />
  {/each}
{/await}
