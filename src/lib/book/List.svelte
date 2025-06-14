<script lang="ts">
  import type { Book } from '$lib/types/types'
  import BookView from '$lib/book/Book.svelte'

  interface Props {
    books: Book[]
    edit?: boolean
    showEditIcon?: boolean
    height?: number
    vertical?: boolean
    className?: string
    bookClass?: string
  }

  let {
    books,
    edit = false,
    showEditIcon = false,
    height = 200,
    vertical = false,
    className = '',
    bookClass = ''
  }: Props = $props()
</script>

<div
  class="container flex w-full items-center gap-4 overflow-x-scroll overflow-y-clip p-4
	{className}"
  style:flex-direction={vertical ? 'column' : 'row'}
>
  {#each books as book}
    <BookView {book} width={height} {edit} {showEditIcon} class={bookClass} />
  {/each}
</div>
