<script lang="ts" module>
  export type CfiLocation = { start: string; end: string }

  export type OnPageTurn = {
    start: string
    end: string
    contents: Contents
    epub: Epub
    metadata: Book
  }

  const SCRIPT = `
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);

    function onMouseMove(e) {
      const mouseMoveEvent = new CustomEvent('readermousemove', { detail: { x: e.screenX, y: e.screenY } });
      window.parent.dispatchEvent(mouseMoveEvent);
    }

    function onMouseDown(e) {
      const mouseDownEvent = new CustomEvent('readermousedown', { detail: { x: e.screenX, y: e.screenY } });
      window.parent.dispatchEvent(mouseDownEvent);
    }

    function onMouseUp(e) {
      const mouseUpEvent = new CustomEvent('readermouseup', { detail: { x: e.screenX, y: e.screenY } });
      window.parent.dispatchEvent(mouseUpEvent);
    }
  `
  const RENDITION_OPTIONS = {
    manager: 'default',
    // flow: 'scrolled',
    // spread: 'always',
    width: '100%',
    height: '100%'
    // snap: true
    // script: `data:text/javascript;charset=utf-8,${SCRIPT}`,
    // resizeOnOrientationChange: true,
    // allowScriptedContent: true
  }

  const RENDITION_THEME = {
    body: {
      width: '100svw',
      'max-width': '100svw',
      'box-sizing': 'border-box',
      'text-align': 'justify'
    }
  }
</script>

<script lang="ts">
  import type { Book as Epub, Contents } from 'epubjs'
  // import cfi from '$lib/util/cfi'
  import ReaderNav from '$lib/buttons/ReaderNav.svelte'
  import type { Book, Relocated } from '$lib/types/types'
  import sounds from '$lib/util/sounds'
  import ePub from 'epubjs'
  import { page } from '$app/state'
  import { GetCoverUrl } from '$lib/util/generateLink'

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

  // Setup ePub
  let epub = $derived(ePub(epubUrl))

  $effect(() => {
    epub.ready.then(() => {
      epub.locations
        .generate(150)
        .then(() => console.log('Locations generated'))
      // epub.locations.generate(1000)

      metadata = {
        id: page.params.id,
        title: epub.packaging.metadata.title,
        author: epub.packaging.metadata.creator,
        coverUrl: GetCoverUrl(epubUrl),
        epubUrl
      }
    })

    return () => epub.destroy()
  })

  // Setup rendition
  let rendition = $derived(epub.renderTo('rendition', RENDITION_OPTIONS))

  $effect(() => {
    rendition.themes.default(RENDITION_THEME)
    rendition.display(location)

    rendition.on('relocated', dispatchPageTurn)
    rendition.on('relocated', updateNavButtons)
    rendition.on('keyup', keyboardNav)
    // rendition.on('selected', dispatchSelected)
    // rendition.on('markClicked', e => console.log(e))
  })

  // Setup everything else
  let atStart = $state(false)
  let atEnd = $state(false)

  // let highlights = [] as Selected[]

  // export function Display(location: string) {
  //   rendition.display(location)
  // }

  // export function Highlight(range: Selected, color?: string) {
  //   const id = new Date().toString()
  //   rendition.annotations.highlight(
  //     range,
  //     { id: id },
  //     (e: any) => {
  //       console.log(e.target)
  //     },
  //     undefined,
  //     color ? { fill: color } : {}
  //   )
  //
  //   highlights.push(range)
  // }

  // export function RemoveHighlight(range: Selected) {
  //   rendition.annotations.remove(range, 'highlight')
  // }

  // export function ClearHighlights() {
  //   for (const h of highlights) RemoveHighlight(h)
  //   highlights = []
  // }

  function dispatchPageTurn(page: Relocated) {
    onPageTurn({
      start: page.start.cfi,
      end: page.end.cfi,
      contents: rendition.getContents(),
      epub,
      metadata
    })
  }

  function updateNavButtons(page: Relocated) {
    atStart = !!page.atStart
    atEnd = !!page.atEnd
  }

  // function dispatchSelected(range: Selected) {
  //   const [start, end] = cfi.split(range)
  //   dispatch('selected', { range, start, end })
  // }

  function keyboardNav(e: KeyboardEvent) {
    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        rendition.prev()
        break

      case 'ArrowRight':
      case 'ArrowDown':
        rendition.next()
        break
    }
  }
</script>

<svelte:head>
  <title>Reading: {metadata.title}</title>
</svelte:head>

<svelte:window onkeydown={keyboardNav} />
<!-- onreadermousemove={e => -->
<!--   dispatch('mousemove', { x: e.detail.x, y: e.detail.y })} -->
<!-- onreadermousedown={e => -->
<!--   dispatch('mousedown', { x: e.detail.x, y: e.detail.y })} -->
<!-- onreadermouseup={e => dispatch('mouseup', { x: e.detail.x, y: e.detail.y })} -->
<!-- onresize={undefined} -->

<div class="h-full max-w-full">
  <div id="rendition" class="max-width-full h-full"></div>

  <div class="flex drop-shadow-lg">
    <ReaderNav onclick={() => rendition.prev()} side="left" hidden={atStart} />
    {#if showPlayButton}
      <button
        onclick={() => sounds.toggle()}
        class="border border-amber-800/10 bg-orange-200/30 px-2 py-1 select-none hover:bg-orange-300/20"
      >
        {'⏵/⏸'}
      </button>
    {/if}
    <ReaderNav onclick={() => rendition.next()} side="right" hidden={atEnd} />
  </div>
</div>
