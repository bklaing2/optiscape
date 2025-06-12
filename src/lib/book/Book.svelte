<script lang="ts">
  import type { Book } from '$lib/types/types'
  import { AspectRatio } from '$lib/components/ui/aspect-ratio/index.js'
  import { Progress } from '$lib/components/ui/progress/index.js'

  interface Props {
    book: Book
    edit?: boolean
    showEditIcon?: boolean
    width?: number
    class?: string
  }

  let {
    book,
    edit = false,
    showEditIcon = false,
    width,
    class: className = ''
  }: Props = $props()

  let percentage = $derived(book.percentage ? book.percentage : -1)
  let href = $derived(`/${edit ? 'edit' : 'read'}/${book.id}`)
</script>

<div
  class={`group mr-2 mb-2 grid grid-cols-min-r-2 content-center items-center gap-2 pt-6 pl-2 ${className}`}
>
  <a
    {href}
    class="col-span-2 block w-full overflow-hidden rounded-l-[2px] rounded-r-[8px] bg-center shadow-[1px_1px_1px_gray,3px_1px_white,5px_3px_black,6px_4px_4px_gray] transition-all duration-100 ease-in-out group-hover:z-10 group-hover:translate-y-[-15px] group-hover:rotate-[-2deg] group-hover:shadow-[1px_1px_1px_gray,3px_1px_white,5px_3px_black,8px_6px_6px_gray]"
  >
    <!-- Render book cover -->
    <AspectRatio
      ratio={5.5 / 8.5}
      style="grid-column: span 1 / span 1;"
      class="w-full bg-(image:--book-cover) bg-contain"
      --book-cover={`url(${book.coverUrl})`}
      --width={width ? width + 'px' : 'inherit'}
    />
  </a>

  {#if percentage >= 0.005 && percentage < 0.995}
    <Progress class="col-span-2 ml-[3px]" value={percentage * 100} />
    <!-- <span class="">{Math.round(percentage * 100)}%</span> -->
  {/if}

  <!-- <a {href} class={`inline-block bg-[url(${book.coverUrl})] h-[${height}px]`}> -->
  <!--   <div class="details"> -->
  <!--     <h3 class="text title">{book.title}</h3> -->
  <!--     <p class="text author">{book.author}</p> -->
  <!--   </div> -->
  <!-- </a> -->
  <!---->
  <!-- <a -->
  <!--   href="/edit/{book.id}" -->
  <!--   style:display={showEditIcon ? undefined : 'none'} -->
  <!--   class="absolute -right-2 -bottom-2 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-amber-900/20 bg-white/30 text-center align-middle backdrop-blur-xs transition-all hover:backdrop-blur-3xl" -->
  <!--   >✏️</a -->
  <!-- > -->
  <!---->
  <!-- {#if percentage > 0.01 && percentage < 0.98} -->
  <!--   <div class="percentage"> -->
  <!--     <progress value={percentage} max="1" class="bar"> -->
  <!--       {`${percentage * 100}%`} -->
  <!--     </progress> -->
  <!--   </div> -->
  <!-- {/if} -->
</div>

<!-- <style> -->
<!--   .book { -->
<!--     width: 100%; -->
<!--     position: relative; -->
<!---->
<!--     box-sizing: content-box; -->
<!---->
<!--     padding: 0; -->
<!--     padding-left: 0px; -->
<!---->
<!--     background-color: black; -->
<!---->
<!--     background-size: contain; -->
<!---->
<!--     z-index: 0; -->
<!--     cursor: pointer; -->
<!---->
<!--     transition: -->
<!--       all 0.1s ease-in-out, -->
<!--       z-index 0s 0.01s; -->
<!--   } -->
<!---->
<!--   .book:hover { -->
<!--     z-index: 10; -->
<!---->
<!--     box-shadow: -->
<!--       1px 1px 1px gray, -->
<!--       3px 1px white, -->
<!--       5px 3px black, -->
<!--       8px 6px 6px gray; -->
<!---->
<!--     transform: translateY(-15px) rotateZ(-2deg); -->
<!--   } -->
<!---->
<!--   .book:active { -->
<!--     box-shadow: -->
<!--       1px 1px 1px gray, -->
<!--       3px 1px white, -->
<!--       5px 3px black, -->
<!--       6px 4px 2px gray; -->
<!---->
<!--     filter: brightness(0.9); -->
<!--   } -->
<!---->
<!--   /* .book:hover .details { -->
<!--     width: 150px; -->
<!--     background: rgba(75, 75, 75, 0.9); -->
<!--   } -->
<!---->
<!--   .book:hover .text { -->
<!--     flex-grow: 0; -->
<!--   } -->
<!--    */ -->
<!---->
<!--   .details { -->
<!--     width: 100%; -->
<!--     height: 100%; -->
<!---->
<!--     padding-left: 10px; -->
<!--     padding-right: 10px; -->
<!--     padding-top: 15px; -->
<!--     padding-bottom: 15px; -->
<!---->
<!--     display: flex; -->
<!--     flex-direction: column; -->
<!--     gap: 0.75rem; -->
<!---->
<!--     background: rgba(75, 75, 75, 0.7); -->
<!--     border-radius: 6px; -->
<!--     border-top-left-radius: 2px; -->
<!--     border-bottom-left-radius: 2px; -->
<!---->
<!--     transition: -->
<!--       all 0.25s ease-in-out, -->
<!--       z-index 1s 1s; -->
<!--   } -->
<!---->
<!--   .text { -->
<!--     width: 100%; -->
<!---->
<!--     margin: 0; -->
<!--     padding: 0; -->
<!---->
<!--     flex-grow: 0; -->
<!---->
<!--     color: white; -->
<!--     text-align: center; -->
<!--     text-shadow: 2px 1px 2px black; -->
<!---->
<!--     overflow: hidden; -->
<!--     transition: all 0.25s ease-in-out; -->
<!--   } -->
<!---->
<!--   .title { -->
<!--     flex-grow: 1; -->
<!---->
<!--     font-size: 1rem; -->
<!--     line-height: 1rem; -->
<!--   } -->
<!---->
<!--   .author { -->
<!--     color: lightgray; -->
<!---->
<!--     font-size: 0.75em; -->
<!--     line-height: 0.75rem; -->
<!--   } -->
<!---->
<!--   .percentage { -->
<!--     position: absolute; -->
<!---->
<!--     bottom: -2px; -->
<!--     left: 4px; -->
<!--     right: 4px; -->
<!---->
<!--     filter: drop-shadow(2px 1px 5px black); -->
<!--     z-index: 11; -->
<!--   } -->
<!---->
<!--   .bar { -->
<!--     width: 100%; -->
<!--   } -->
<!-- </style> -->
