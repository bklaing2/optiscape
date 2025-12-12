<script lang="ts">
  import { Button } from '$lib/components/ui/button'
  import NavLink from '$lib/buttons/NavLink.svelte'
  import MenuIcon from 'virtual:icons/tabler/menu-2'
  import CloseIcon from 'virtual:icons/tabler/x'
  import { resolve } from '$app/paths'

  let showNav = $state(false)
</script>

<header class="group my-6 flex w-full items-center px-6">
  <a
    href={resolve('/')}
    class={`absolute flex items-center gap-2 overflow-hidden text-xl text-amber-900 transition-all sm:justify-end ${showNav ? 'max-sm:opacity-0' : 'max-sm:delay-100 max-sm:duration-250'}`}
  >
    <img
      src={resolve('/favicon.png')}
      alt="optiscape icon"
      class="aspect-square h-8"
    />
    Optiscape
  </a>

  <div
    class={`ms-auto flex w-full items-center justify-end overflow-hidden rounded-full transition-all ease-out sm:w-min sm:group-hover:bg-black/3 sm:group-hover:shadow-xl sm:group-hover:shadow-black/3 ${showNav ? 'max-sm:min-w-full max-sm:bg-black/5 max-sm:shadow-xl max-sm:shadow-black/5 max-sm:delay-100 max-sm:duration-1000' : 'max-sm:min-w-0'}`}
  >
    <nav
      class={`flex  scrollbar-hidden grow gap-x-1 overflow-x-auto transition-all ease-out sm:max-w-500 ${showNav ? 'max-sm:max-w-500 max-sm:delay-100 max-sm:duration-1000' : 'max-sm:max-w-0'}`}
    >
      <ul class="contents">
        <NavLink href={resolve('/')}>Home</NavLink>
        <NavLink href={resolve('/books')}>Books</NavLink>
        <NavLink href={resolve('/about')}>About</NavLink>
      </ul>
    </nav>

    <Button
      onclick={() => (showNav = !showNav)}
      class="flex-none text-xl text-rose-700 sm:hidden"
      variant="ghost"
    >
      {#if showNav}
        <CloseIcon />
      {:else}
        <MenuIcon />
      {/if}
    </Button>
  </div>
</header>
