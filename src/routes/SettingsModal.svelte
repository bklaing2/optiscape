<script lang="ts">
  import { page } from '$app/state'
  import * as Dialog from '$lib/components/ui/dialog/index.js'
  import type { Settings } from '$lib/types'
  import SettingsContent from './settings/SettingsContent.svelte'

  let { settings = {} satisfies Settings, open = false, onClose } = $props()

  function onOpenChange(open: boolean) {
    if (!open && onClose) onClose()
  }
</script>

<Dialog.Root open={page.url.pathname !== '/settings' && open} {onOpenChange}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Settings</Dialog.Title>
    </Dialog.Header>
    <div class="flex w-full max-w-sm flex-col gap-1.5">
      <SettingsContent {settings} />
    </div>
  </Dialog.Content>
</Dialog.Root>
