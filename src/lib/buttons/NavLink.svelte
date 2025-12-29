<script lang="ts" module>
  import type { HTMLAnchorAttributes } from 'svelte/elements'

  interface Props extends HTMLAnchorAttributes {
    hidden?: boolean
    active?: boolean
  }
</script>

<script lang="ts">
  import { page } from '$app/state'

  let { hidden = false, active = undefined, ...props }: Props = $props()
  let isActive = $derived(
    active !== undefined ? active : page.url.pathname === props.href
  )
</script>

<li class="contents" aria-current={active ? 'page' : undefined}>
  <a
    data-sveltekit-noscroll
    class="rounded-full border px-5 py-2 text-nowrap hover:text-amber-900 {isActive
      ? 'border-amber-900/20  bg-orange-200/30'
      : 'border-transparent'}  {hidden ? 'hidden' : ''}"
    {...props}
  >
    {@render props.children?.()}
  </a>
</li>
