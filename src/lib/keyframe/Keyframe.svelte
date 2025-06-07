<script lang="ts" module>
	export type Keyframe = {
		id: number
		category: 'music' | 'ambience' | 'sfx'
		source: string
		start: string
		end: string
		snippetStart: string
		snippetEnd: string
		start_percentage: number
		end_percentage: number
	};
</script>

<script lang="ts">
	import { createEventDispatcher } from 'svelte'

	const dispatch = createEventDispatcher()

	interface Props {
		keyframe: Keyframe;
	}

	let { keyframe }: Props = $props();
</script>


<div class="container">
	<button class="snippet" onclick={() => dispatch('click', keyframe)}>
		{keyframe.snippetStart}
	</button>

	<div class="buttons">
		<button onclick={() => dispatch('edit', keyframe)}>edit</button>
		<button onclick={() => dispatch('delete', keyframe)}>X</button>
	</div>
</div>

<style>
	.container {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.snippet {
		flex-grow: 1;

		background-color: unset;
		border: 1px solid gray;
		border-radius: 2px;

		text-align: start;

		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;

		cursor: pointer;
	}

	.snippet:active {
		background-color: gray;
	}

	.buttons {
		min-width: max-content;
	}
</style>