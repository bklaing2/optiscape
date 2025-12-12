<script lang="ts">
  import { createBubbler } from 'svelte/legacy'

  interface Props {
    side: 'left' | 'right'
    hidden?: boolean
    onclick?: () => void
  }

  let { side, hidden = false, onclick }: Props = $props()
</script>

<button
  id="prev"
  class={`grow touch-manipulation border-y border-amber-800/10 bg-orange-200/30 py-1 select-none hover:bg-orange-300/20 ${side === 'left' ? 'rounded-l-full border-l' : 'rounded-r-full border-r'} ${hidden && 'invisible'}`}
  {onclick}
>
  {side === 'left' ? '‹' : '›'}
</button>

