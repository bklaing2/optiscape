<script lang="ts" module>
  import { SEARCH_PARAMS } from '$lib/constants'
  const { FILTER_BOOKS } = SEARCH_PARAMS
</script>

<script lang="ts">
  import type { PageProps } from './$types'
  import { resolve } from '$app/paths'
  import BookView from '$lib/book/Book.svelte'

  let { data }: PageProps = $props()
  let showEditIcon = false // $derived(searchParams.has('edit'))
</script>

<form action={resolve('/books')} class="contents">
  {#each Object.entries(data.searchParams)
    .filter(([, v]) => v)
    .filter(([k]) => k !== FILTER_BOOKS) as [key, value]}
    <input type="hidden" name={key} {value} />
  {/each}
  <input
    type="text"
    name={FILTER_BOOKS}
    placeholder="Search books"
    value={data.searchParams[FILTER_BOOKS]}
    class="col-span-full mb-6 h-min rounded-full border border-amber-900/0 bg-orange-200/60 px-8 py-4 outline-hidden transition placeholder:text-slate-600 focus:border-amber-900/20"
  />
</form>

{#each data.books as book (book.id)}
  <BookView {book} {showEditIcon} class="w-full" />
{/each}
