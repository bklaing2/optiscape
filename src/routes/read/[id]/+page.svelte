<script lang="ts">
  import { page } from '$app/state'
  import { loadReadingRate, updateReadingRate } from '$lib/util/storage.js'
  import { updateBook } from '$lib/db'
  import { DecodeEpubUrl } from '$lib/util/generateLink'
  import Reader, { type OnPageTurn } from '$lib/book/Reader.svelte'

  let readingRate = $state(loadReadingRate())
  let characterCount: number
  let startTime = Number.NEGATIVE_INFINITY

  function onPageTurn({ cfi, percentage, content, bookMetadata }: OnPageTurn) {
    updateBook({ ...bookMetadata, location: cfi, percentage })

    // Update reading rate
    handleReadingRate()
    updateReadingRate(readingRate)

    async function handleReadingRate() {
      // Calculate reading rate
      const elapsedMinutes = (Date.now() - startTime) / 60000
      if (elapsedMinutes > 0.25 && elapsedMinutes < 10)
        readingRate.push(characterCount / elapsedMinutes)

      // Set up next reading rate
      startTime = Date.now()
      characterCount = content.length
    }
  }
</script>

<Reader epubUrl={DecodeEpubUrl(page.params.id)} {onPageTurn} />
