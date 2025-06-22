<script lang="ts">
  import type { Book } from '$lib/types/types'
  import { onMount } from 'svelte'
  import { getHistory } from '$lib/db'
  import BookView from '$lib/book/Book.svelte'

  let history = $state([] as Book[])

  onMount(async () => (history = await getHistory()))
</script>

<div class="col-span-full grid grid-cols-3 gap-x-2 sm:grid-cols-5">
  <h1 class="col-span-full text-xl">History</h1>

  {#each history as book (book.id)}
    <BookView {book} class="w-full" />
  {/each}
</div>
