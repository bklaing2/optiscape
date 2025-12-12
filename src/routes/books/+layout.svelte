<script lang="ts">
  import type { LayoutProps } from './$types'
  import { page } from '$app/state'
  import { ScrollArea } from '$lib/components/ui/scroll-area/index.js'
  import NavLink from '$lib/buttons/NavLink.svelte'
  import { resolve } from '$app/paths'

  let { data, children }: LayoutProps = $props()
  let { categories, entries } = $derived(data)
  let searchParams = $derived(page.url.searchParams)
  let category = $derived(searchParams.get('category'))
  let entry = $derived(searchParams.get('entry'))
  let filter = $derived(searchParams.get('filter'))
</script>

<div class="grid w-full max-w-full grid-cols-min-r-2 gap-2">
  <!-- <h1 class="col-span-full text-2xl">Optiscape books</h1> -->

  <ScrollArea class="col-span-full" orientation="horizontal">
    <ul class="flex w-max">
      <NavLink href={resolve('/books')} active={!category}>ALL BOOKS</NavLink>
      {#await categories}
        Loading categories...
      {:then categories}
        {#each categories as c}
          <NavLink
            href={resolve(`/books?category=${c.id}`)}
            active={c.id === category}>{c.text}</NavLink
          >
        {/each}
      {/await}
    </ul>
  </ScrollArea>

  {#await entries}
    Loading entries...
  {:then entries}
    {#if entries.length > 0}
      <form action="/books" class="contents">
        {#each [...searchParams.entries()].filter(([k]) => k !== 'filter') as [key, value]}
          <input type="hidden" name={key} {value} />
        {/each}
        <input
          type="text"
          name="filter"
          placeholder="Search subcategories..."
          value={filter}
          class="col-span-full mt-6 h-min rounded-full border border-amber-900/0 bg-orange-200/60 px-6 py-1 outline-hidden transition placeholder:text-slate-600 focus:border-amber-900/20"
        />
      </form>

      <ScrollArea class="col-span-full mb-6" orientation="horizontal">
        <ul class="flex w-max">
          {#each entries as e}
            <NavLink
              href={resolve(`/books?category=${category}&entry=${e.id}`)}
              active={e.id === entry}
            >
              {e.text}
            </NavLink>
          {/each}
        </ul>
      </ScrollArea>
    {/if}
  {/await}

  <div class="col-span-full grid grid-cols-3 gap-x-2 sm:grid-cols-5">
    {@render children?.()}
  </div>
</div>
