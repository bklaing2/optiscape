<script lang="ts">
  import { page } from '$app/state'
  import { afterNavigate, pushState } from '$app/navigation'
  import type { LayoutProps } from './$types'
  import '../app.css'
  import Header from './Header.svelte'
  import Footer from './Footer.svelte'
  import SettingsModal from './SettingsModal.svelte'
  import { loadSettings, updateSettings } from '$lib/util/storage'
  import type { Settings } from '$lib/types'

  let { children }: LayoutProps = $props()
  let settings = $state({} satisfies Settings)
  let settingsOpen = $state(page.url.pathname === '/settings')

  async function onSettingsClick(
    e: MouseEvent & { currentTarget: EventTarget & HTMLAnchorElement }
  ) {
    if (
      e.shiftKey || // bail if the link is opened in a new window
      e.metaKey ||
      e.ctrlKey // or a new tab (mac: metaKey, win/linux: ctrlKey)
      // should also consider clicking with a mouse scroll wheel
    )
      return

    // prevent navigation
    e.preventDefault()

    settings = loadSettings()
    settingsOpen = page.url.pathname !== '/settings'
    pushState(e.currentTarget.href, {})
  }

  let prevPage = $state('/')

  afterNavigate(
    ({ to }) => (prevPage = `${to?.url.pathname || '/'}${to?.url.search}`)
  )

  function onSettingsModalClose(open: boolean) {
    // Don't do anything when opening the modal
    if (open) return

    // Save the settings
    updateSettings(settings)

    // Close the modal and navigate back to the previous page
    pushState(prevPage, {})
    settingsOpen = false
  }
</script>

<div
  class="mx-auto grid w-full max-w-4xl grid-cols-1 grid-rows-[min-content_minmax(min-content,1fr)_min-content] gap-8 pb-16"
>
  <Header {onSettingsClick} />

  <main class="box-border flex w-full flex-col px-4">
    {@render children()}
  </main>

  <Footer />

  <SettingsModal
    {settings}
    open={settingsOpen}
    onClose={onSettingsModalClose}
  />
</div>
