<script lang="ts">
  import { Input } from '$lib/components/ui/input/index.js'
  import { Label } from '$lib/components/ui/label/index.js'
  import type { Settings } from '$lib/types'

  let { settings = $bindable<Settings>() } = $props()
</script>

<Label for="api-key">LLM API Key</Label>
<Input
  type="password"
  id="api-key"
  placeholder="LLM API Key"
  bind:value={settings.llmApiKey}
/>
