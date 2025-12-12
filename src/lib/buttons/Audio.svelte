<script lang="ts">
  interface Props {
    src: string;
  }

  let { src }: Props = $props();
  let audio: HTMLAudioElement = $state()
  let isPlaying = $state(false)

  function OnClick () {
    if (isPlaying) {
      audio.pause()
      audio.currentTime = 0
    }
    else audio.play()

    isPlaying = !isPlaying
  }
</script>



<button onclick={OnClick} type="button" class="select-none">{isPlaying ? '⏸' : '▶️'}</button>
<audio {src} bind:this={audio}></audio>