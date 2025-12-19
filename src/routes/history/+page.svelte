<script lang="ts">
  import type { PageProps } from './$types'
  import BookView from '$lib/book/Book.svelte'

  let { data }: PageProps = $props()
</script>

<div class="col-span-full grid grid-cols-3 gap-x-2 sm:grid-cols-5">
  <h1 class="col-span-full text-xl">History</h1>

  {#each data.history as book (book.id)}
    <BookView {book} class="w-full" />
  {/each}
</div>
