<script lang="ts">
  import type { Keyframe } from '$lib/types/types'
  import { page } from '$app/state'
  import { updateHistory, updateReadingRate } from '$lib/util/storage.js'
  import storage from '$lib/util/storage.js'
  import { getHistory, updateBook } from '$lib/db'
  import sounds from '$lib/util/sounds'
  import cfi from '$lib/util/cfi'
  import Reader, { type OnPageTurn } from '$lib/book/Reader.svelte'
  import { onMount } from 'svelte'
  import { DecodeEpubUrl } from '$lib/util/generateLink'

  let location = $state(page.url.searchParams.get('location') ?? undefined)

  let readingRate = $state(storage.loadReadingRate())
  let characterCount: number
  let startTime = Number.NEGATIVE_INFINITY
  let pendingKeyframes = {
    start: [] as NodeJS.Timeout[],
    end: [] as { timeout: NodeJS.Timeout; kf: Keyframe }[]
  }

  onMount(async () => {
    const history = await getHistory()
    const saved = history.find(b => page.params.id === b.id)
    location = location ?? saved?.location
  })

  function onPageTurn({ start, end, epub, metadata }: OnPageTurn) {
    location = start
    const percentage = epub.locations.percentageFromCfi(start)
    // page.url.searchParams.set('location', start)
    // // replaceState('', { location: start })
    // goto(page.url, { replaceState: true, state: { location: start } })
    updateBook({ ...metadata, location, percentage })
    // updateHistory(metadata, start, epub.locations.percentageFromCfi(end))

    // Update reading rate
    handleReadingRate()
    updateReadingRate(readingRate)

    clearPendingKeyframes()
    handleKeyframes()

    async function handleReadingRate() {
      // Calculate reading rate
      const elapsedMinutes = (Date.now() - startTime) / 60000
      if (elapsedMinutes > 0.25 && elapsedMinutes < 10)
        readingRate.push(characterCount / elapsedMinutes)

      // Set up next reading rate
      startTime = Date.now()
      characterCount = await cfi.countChars(start, end, epub)
      updateReadingRate(readingRate)
    }

    async function handleKeyframes() {
      // Fetch key frames in range from db
      const startPercentage = epub.locations.percentageFromCfi(start)
      const endPercentage = epub.locations.percentageFromCfi(end)
      const response = await fetch(
        `/api/optiscapes/${page.params.id}/script?start=${startPercentage}&end=${endPercentage}`
      )
      const script = (await response.json()) as Keyframe[]

      for (const kf of script) {
        startKeyframe(kf, start, end)
        endKeyframe(kf, start, end)
      }
    }

    async function startKeyframe(kf: Keyframe, start: string, end: string) {
      console.log('START KEY FRAME', kf.category)
      const [kfStart] = cfi.split(kf.start)
      if (!cfi.inRange(kfStart, start, end)) return

      const offset = await cfi.countChars(start, kfStart, epub)
      const delay = (offset / readingRate.Average) * 60000

      const t = setTimeout(() => {
        console.log('KEY FRAME STARTED', kf)
        switch (kf.category) {
          case 'music':
            sounds.changeMusic(kf.source)
            break

          case 'ambience':
            sounds.addAmbience(kf.source)
            break

          case 'sfx':
            sounds.playSfx(kf.source)
            break
        }
      }, delay)

      pendingKeyframes.start.push(t)
    }

    async function endKeyframe(kf: Keyframe, start: string, end: string) {
      console.log('END KEY FRAME', kf.category)
      if (!kf.end) return
      const [, kfEnd] = cfi.split(kf.end)
      if (!cfi.inRange(kfEnd, start, end)) return

      const offset = await cfi.countChars(start, kfEnd, epub)
      const delay = (offset / readingRate.Average) * 60000

      const t = setTimeout(() => onEndKeyFrame(kf), delay)
      pendingKeyframes.end.push({ timeout: t, kf })
    }
  }

  function onEndKeyFrame(kf: Keyframe) {
    console.log('KEY FRAME ENDED', kf)
    switch (kf.category) {
      case 'music':
        sounds.endMusic(kf.source)
        break

      case 'ambience':
        sounds.removeAmbience(kf.source)
        break
    }
  }

  function clearPendingKeyframes() {
    pendingKeyframes.start.forEach(clearTimeout)
    pendingKeyframes.start = []

    pendingKeyframes.end.forEach(({ timeout, kf }) => {
      clearTimeout(timeout)
      onEndKeyFrame(kf)
    })
  }
</script>

<Reader epubUrl={DecodeEpubUrl(page.params.id)} {location} {onPageTurn} />
