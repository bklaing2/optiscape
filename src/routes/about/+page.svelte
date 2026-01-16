<script>
  import { resolve } from '$app/paths'
</script>

<h1>About Optiscape</h1>

<p class="mt-8">
  Optiscape adds a musical layer to audiobooks. As you read, it analyzes the
  text and plays fitting music.
  <br /><br />
  When reading a <a href={resolve('/books')} class="underline">book</a>, press
  the Play button to generate music. Sometimes it can take a little while to
  start playing.
  <br /><br />
</p>
<strong
  >In order to use it, you must first supply the following in settings:</strong
>
<ul class="list-disc ps-4">
  <li>
    an OpenAI API Key that can use
    <code
      class="relative rounded bg-gray-500/10 px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
    >
      gpt-5.2
    </code>
  </li>
  <li>
    a Google Gemini API Key for
    <a
      class="underline"
      href="https://deepmind.google/models/lyria/lyria-realtime/"
    >
      Lyria Realtime
    </a>
  </li>
</ul>
