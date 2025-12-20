<script lang="ts" module>
  import type { Book } from '$lib/types/types'

  export type OnPageTurn = {
    cfi: string
    percentage: number
    content: string
    bookMetadata: Book
  }
</script>

<script lang="ts">
  import type {
    FoliateView,
    LoadEvent,
    RelocateEvent
  } from '$lib/types/foliate'
  import { page } from '$app/state'
  import { onMount } from 'svelte'
  import { deepEqual } from '$lib/util/helpers'
  import { getCurrentlyReading } from '$lib/db'
  import { GetCoverUrl } from '$lib/util/generateLink'
  import sounds from '$lib/util/sounds'
  import ReaderNav from '$lib/buttons/ReaderNav.svelte'
  import { FOLIATE_VIEW } from '$lib/constants'

  interface Props {
    epubUrl: string
    location?: string | undefined
    showPlayButton?: boolean
    onPageTurn?: (args: OnPageTurn) => void
  }

  let {
    epubUrl,
    location = undefined,
    showPlayButton = false,
    onPageTurn = () => {}
  }: Props = $props()

  let metadata = $state({
    id: page.params.id,
    title: '',
    author: '',
    coverUrl: GetCoverUrl(epubUrl),
    epubUrl
  } as Book)

  // Setup foliate
  let foliateView: FoliateView
  let atStart = $state(false)
  let atEnd = $state(false)

  onMount(async () => {
    const currentlyReading = await getCurrentlyReading()
    const saved = currentlyReading.find(b => page.params.id === b.id)
    location = saved?.location

    await import(/* @vite-ignore */ FOLIATE_VIEW)
    await foliateView.open(epubUrl)

    if (location) foliateView.goTo(location)
    else foliateView.renderer.next()

    const book = foliateView.book

    metadata = {
      id: page.params.id,
      title: book.metadata.title,
      author: book.metadata.author.name,
      coverUrl: GetCoverUrl(epubUrl),
      epubUrl
    }

    foliateView.addEventListener('load' as any, onLoad)
    foliateView.addEventListener('relocate' as any, onRelocate)
    foliateView.addEventListener('relocate' as any, updateNavButtons)
  })

  onMount(() => () => foliateView.close())

  function onLoad({ detail: loadMetadata }: LoadEvent) {
    loadMetadata.doc.addEventListener('keydown', keyboardNav)
  }

  let prevRelocateMetadata: RelocateEvent['detail']

  function onRelocate({ detail: relocateMetadata }: RelocateEvent) {
    if (deepEqual(relocateMetadata, prevRelocateMetadata)) return

    const text = relocateMetadata.range.toString()

    onPageTurn({
      cfi: relocateMetadata.cfi,
      percentage: relocateMetadata.fraction,
      content: text,
      bookMetadata: metadata
    })

    prevRelocateMetadata = relocateMetadata
  }

  function updateNavButtons() {
    atStart = foliateView.renderer.atStart
    atEnd = foliateView.renderer.atEnd
  }

  function previousPage() {
    foliateView.goLeft()
  }

  async function nextPage() {
    foliateView.goRight()
  }

  function keyboardNav(e: KeyboardEvent) {
    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        previousPage()
        break

      case 'ArrowRight':
      case 'ArrowDown':
        nextPage()
        break
    }
  }
</script>

<svelte:head>
  <title>Reading: {metadata.title}</title>
</svelte:head>

<svelte:window onkeydown={keyboardNav} />

<div class="m-auto h-full w-full max-w-lg">
  <foliate-view bind:this={foliateView}></foliate-view>
  <div class="flex drop-shadow-lg">
    <ReaderNav onclick={() => previousPage()} side="left" hidden={atStart} />
    {#if showPlayButton}
      <button
        onclick={() => sounds.toggle()}
        class="border border-amber-800/10 bg-orange-200/30 px-2 py-1 select-none hover:bg-orange-300/20"
      >
        {'⏵/⏸'}
      </button>
    {/if}
    <ReaderNav onclick={() => nextPage()} side="right" hidden={atEnd} />
  </div>
</div>
