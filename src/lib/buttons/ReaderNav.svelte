<script lang="ts">
  import { createBubbler } from 'svelte/legacy';

  const bubble = createBubbler();
  interface Props {
    side: 'left' | 'right';
    hidden?: boolean;
  }

  let { side, hidden = false }: Props = $props();
</script>


<button
  id="prev"
  class={`
    grow
    py-1
    bg-orange-200/30
    border-y
    border-amber-800/10
    hover:bg-orange-300/20
    ${side === 'left' ? 'border-l' : 'border-r'}
    ${side === 'left' ? 'rounded-l-full' : 'rounded-r-full'}
    ${hidden && 'invisible'}
    select-none
    touch-manipulation
  `}
  onclick={bubble('click')}
>
  {side === 'left' ? '‹' : '›'}
</button>