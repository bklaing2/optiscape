<script lang="ts" module>
  import { SEARCH_PARAMS } from '$lib/constants'
  const { COLLECTION, SHELF, FILTER_SHELVES } = SEARCH_PARAMS
</script>

<script lang="ts">
  import type { LayoutProps } from './$types'
  import { resolve } from '$app/paths'
  import { ScrollArea } from '$lib/components/ui/scroll-area/index.js'
  import NavLink from '$lib/buttons/NavLink.svelte'

  let { data, children }: LayoutProps = $props()
</script>

<div class="grid w-full max-w-full grid-cols-min-r-2 gap-2">
  <!-- <h1 class="col-span-full text-2xl">Optiscape books</h1> -->

  <ScrollArea class="col-span-full" orientation="horizontal">
    <ul class="flex w-max">
      {#each data.collections as collection}
        <NavLink
          href={resolve(`/books${collection.searchParams}`)}
          active={collection.id === data.searchParams[COLLECTION]}
          >{collection.text}</NavLink
        >
      {/each}
    </ul>
  </ScrollArea>

  {#if data.shelves.length > 0}
    <!-- Filter subsection input -->
    <form action={resolve('/books')} class="contents">
      <!-- Include current search params as hidden inputs to be passed on form submission -->
      {#each Object.entries(data.searchParams)
        .filter(([, v]) => v)
        .filter(([k]) => k !== FILTER_SHELVES) as [key, value]}
        <input type="hidden" name={key} {value} />
      {/each}
      <input
        type="text"
        name={FILTER_SHELVES}
        placeholder="Search {data.searchParams[COLLECTION]}..."
        value={data.searchParams[FILTER_SHELVES]}
        class="col-span-full mt-6 h-min rounded-full border border-amber-900/0 bg-orange-200/60 px-6 py-1 outline-hidden transition placeholder:text-slate-600 focus:border-amber-900/20"
      />
    </form>

    <!-- Subsection nav buttons -->
    <ScrollArea class="col-span-full mb-6" orientation="horizontal">
      <ul class="flex w-max">
        {#each data.shelves as shelf}
          <NavLink
            href={resolve(`/books${shelf.searchParams}`)}
            active={shelf.id === data.searchParams[SHELF]}
          >
            {shelf.text}
          </NavLink>
        {/each}
      </ul>
    </ScrollArea>
  {/if}

  <div class="col-span-full grid grid-cols-3 gap-x-2 sm:grid-cols-5">
    {@render children?.()}
  </div>
</div>
