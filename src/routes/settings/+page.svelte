<script lang="ts">
  import type { PageProps } from './$types'
  import { Button } from '$lib/components/ui/button/index.js'
  import SettingsContent from './SettingsContent.svelte'
  import { updateSettings } from '$lib/util/storage'

  let { data }: PageProps = $props()
  let settings = $state(data.settings)

  function onSave() {
    updateSettings(settings)
  }
</script>

<SettingsContent {settings} />

<Button onclick={onSave}>Save</Button>
