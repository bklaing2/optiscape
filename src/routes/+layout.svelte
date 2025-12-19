<script lang="ts">
  import type { LayoutProps } from './$types'
  import '../app.css'
  import Header from './Header.svelte'
  import Footer from './Footer.svelte'

  let { children }: LayoutProps = $props()
</script>

<div
  class="mx-auto grid w-full max-w-4xl grid-cols-1 grid-rows-[min-content_minmax(min-content,1fr)_min-content] gap-8 pb-16"
>
  <Header />

  <main class="box-border flex w-full flex-col px-4">
    {@render children()}
  </main>

  <Footer />
</div>
