<script lang="ts">
  import { page } from '$app/state'
  import type { PageProps } from './$types'
  import { readingRate as readingRateStorage } from '$lib/util/storage.js'
  import { updateBook } from '$lib/db'
  import { DecodeEpubUrl } from '$lib/util/generateLink'
  import Reader, { type OnPageTurn } from '$lib/book/Reader.svelte'
  import { debounce } from '$lib/utils'

  let { data }: PageProps = $props()
  let { llm, lyria } = $derived(data)

  let readingRate = $state(readingRateStorage.load())
  let characterCount: number
  let startTime = Number.NEGATIVE_INFINITY
  let previousText = ''

  async function onPageTurn({
    cfi,
    percentage,
    content: text,
    bookMetadata
  }: OnPageTurn) {
    const timeOfPageTurn = Date.now()

    updateMusic(text, timeOfPageTurn)
    updateBook({ ...bookMetadata, location: cfi, percentage })
    updateReadingRate(text)

    previousText = text
  }

  const updateMusic = debounce(async (text: string, startTime: number) => {
    console.info('Requesting music prompts with', lyria.prompts)
    const music = await llm.requestMusic(previousText, text, lyria.prompts)

    console.info('Music prompts:', music)
    if (!music) return

    const positionInContent =
      text.indexOf(music.anchor) !== -1
        ? text.indexOf(music.anchor)
        : text.length / 2

    const delay =
      (positionInContent / readingRate.Average) * // delay in minutes
        60000 - // delay in ms
      (Date.now() - startTime) // account for time taken to get response from LLM

    setTimeout(() => lyria.setWeightedPrompts(music.prompts), delay)

    if (delay > 3000)
      console.info(
        `Playing music for '${music.anchor}' in ${delay / 1000} sec (${delay / 60000} min)`
      )
  }, 1000)

  async function updateReadingRate(text: string) {
    // Calculate reading rate
    const elapsedMinutes = (Date.now() - startTime) / 60000
    if (elapsedMinutes > 0.25 && elapsedMinutes < 10)
      readingRate.push(characterCount / elapsedMinutes)

    // Set up next reading rate
    startTime = Date.now()
    characterCount = text.length

    readingRateStorage.update(readingRate)
  }

  async function onPlayPause() {
    lyria.playPause()
  }

  $effect(() => console.log(lyria.isPlaying))
</script>

<Reader
  epubUrl={DecodeEpubUrl(page.params.id)}
  showPlayButton
  isPlaying={lyria.isPlaying}
  {onPageTurn}
  {onPlayPause}
/>
