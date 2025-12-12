<script lang="ts">
  import { resolve } from '$app/paths'
  import type { PageProps } from './$types'
  import type { Book } from '$lib/types/types'
  import { onMount } from 'svelte'
  import { getCurrentlyReading, getHistory } from '$lib/db'

  import { ScrollArea } from '$lib/components/ui/scroll-area/index.js'
  import BookView from '$lib/book/Book.svelte'
  import SeeAll from '$lib/buttons/SeeAll.svelte'

  let { data }: PageProps = $props()
  let { optiscapes } = $derived(data)

  let currentlyReading = $state([] as Book[])
  let history = $state([] as Book[])

  onMount(async () => {
    currentlyReading = await getCurrentlyReading()
    history = await getHistory()
  })
</script>

<svelte:head>
  <title>Optiscape</title>
  <meta
    name="description"
    content="Enhance your reading experience with music and sounds"
  />
</svelte:head>

<div class="grid w-full max-w-full grid-cols-min-r-2 gap-8 gap-x-32">
  {#if currentlyReading.length > 0}
    <h2 class="col-span-full text-xl">Currently Reading</h2>

    <ScrollArea class="col-span-full" orientation="horizontal">
      <div class="flex w-max gap-6">
        {#each currentlyReading as book (book.id)}
          <BookView {book} class="w-48" />
        {/each}
      </div>
    </ScrollArea>
  {/if}

  {#if history.length > 0}
    <h2>History</h2>
    <div class="justify-self-end">
      <SeeAll href={resolve('/history')} />
    </div>

    <ScrollArea class="col-span-full" orientation="horizontal">
      <div class="flex w-max gap-4">
        {#each history as book (book.id)}
          <BookView {book} class="w-32" />
        {/each}
      </div>
    </ScrollArea>
  {/if}

  <h2 class="text-xl">Optiscape books</h2>
  <div class="justify-self-end">
    <SeeAll href={resolve('/books')} />
  </div>

  <ScrollArea class="col-span-full" orientation="horizontal">
    <div class="flex w-max gap-4">
      {#await optiscapes}
        Loading books...
      {:then optiscapes}
        {#each optiscapes as book (book.id)}
          <BookView {book} class="w-32" />
        {/each}
      {:catch error}
        {@debug error}
      {/await}
    </div>
  </ScrollArea>
</div>
