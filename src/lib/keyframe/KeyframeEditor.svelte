<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Keyframe } from '$lib/types/types';
	import type { SearchResults } from '$lib/types/freesound';
	import Debounce from '$lib/util/debounce';
	import { Search } from '$lib/util/freesound';
	import Modal from '$lib/Modal.svelte';
	import Audio from '$lib/buttons/Audio.svelte';
	import { enhance } from '$app/forms';
	import type { ActionResult } from '@sveltejs/kit';

	interface Props {
		show?: boolean;
		keyframe: Partial<Keyframe & { start_snippet: string; end_snippet: string }>;
	}

	let { show = $bindable(false), keyframe = $bindable() }: Props = $props();

	const dispatch = createEventDispatcher<{
		discarded: undefined;
		viewSnippet: string;
		keyframeAdded: Keyframe;
	}>();

	let searchInput: HTMLInputElement = $state();

	let canAdd =
		$derived(!!keyframe.source &&
		((keyframe.category === 'sfx' && !!keyframe.start) || (!!keyframe.start && !!keyframe.end)));
	let addButtonText = $derived(!keyframe.category
		? 'Choose audio type'
		: !keyframe.source
		? 'Choose/Upload audio'
		: keyframe.category !== 'sfx' && !keyframe.end
		? 'Select end range'
		: 'Add');

	const debounce = new Debounce();
	let searchResults: SearchResults = $state({ sounds: [], count: 0 });

	function OnSearch(e: any) {
		debounce.buffer(async () => (searchResults = await Search(e.target?.value)));
	}

	function Reset() {
		dispatch('discarded');
		searchInput.value = '';
		searchResults = { sounds: [], count: 0 };
		show = false;
	}

	function OnSubmit() {
		return async ({ result }: { result: ActionResult }) => {
			dispatch('keyframeAdded', result.data.keyframe as Keyframe);
			Reset();
		};
	}
</script>

<form action="?/create" method="POST" use:enhance={OnSubmit}>
	<Modal bind:show>
		{#snippet header()}
				<h2  class="text-white text-center text-2xl col-span-full drop-shadow-sm">
				Add {keyframe.category}
			</h2>
			{/snippet}

		<div class="grid grid-rows-[1fr_min-content] col-span-full">
			<!-- Category Selector
      <div class="bg-orange-200/30 p-1 mx-auto rounded-full flex gap-1">
        <div class="flex">
          <input type="radio" name="category" value="sfx" id="sfx" bind:group={keyframe.category} class="peer hidden" />
          <label for="sfx" class="px-8 py-4 border border-transparent rounded-full cursor-pointer hover:bg-orange-200/50 peer-checked:bg-orange-200 peer-checked:border-amber-900/20">SFX</label>
        </div>

        <div class="flex">
          <input type="radio" name="category" value="ambience" id="ambience" bind:group={keyframe.category} class="peer hidden" />
          <label for="ambience" class="px-8 py-4 border border-transparent rounded-full cursor-pointer hover:bg-orange-200/50 peer-checked:bg-orange-200 peer-checked:border-amber-900/20">Ambience</label>
        </div>
        
        <div class="flex">
          <input type="radio" name="category" value="music" id="music" bind:group={keyframe.category} class="peer hidden" />
          <label for="music" class="px-8 py-4 border border-transparent rounded-full cursor-pointer hover:bg-orange-200/50 peer-checked:bg-orange-200 peer-checked:border-amber-900/20">Music</label>
        </div>
      </div> -->

			<input
				type="text"
				bind:this={searchInput}
				placeholder="Search for sound..."
				onkeyup={OnSearch}
				class="bg-orange-200/30 h-min mb-6 px-8 py-4 rounded-full outline-hidden placeholder:text-slate-600"
			/>

			<div class="flex flex-col">
				{#each searchResults.sounds as sound}
					<div class="contents">
						<input
							type="radio"
							name="source"
							value={sound.url}
							id={sound.url}
							bind:group={keyframe.source}
							class="peer hidden"
						/>
						<label
							for={sound.url}
							class="flex gap-4 px-8 py-4 border border-transparent rounded-full cursor-pointer hover:bg-orange-200/50 peer-checked:bg-orange-200 peer-checked:border-amber-900/20"
						>
							<Audio src={sound.url} />
							{sound.name}
						</label>
					</div>
				{/each}
			</div>

			<span class="text-xs mt-10">Snippet</span>
			<span class="text-xs text-slate-700 truncate"
				>{keyframe.start_snippet || ''}{keyframe.end_snippet || ''}</span
			>

			<span class="text-xs mt-2">CFI range</span>
			<span class="text-xs text-slate-700"
				>{keyframe.start || ''}{keyframe.end ? ' - ' : ''}{keyframe.end || ''}</span
			>
			<input name="start" value={keyframe.start} type="hidden" />
			<input name="end" value={keyframe.end} type="hidden" />

			<input name="category" value={keyframe.category} type="hidden" />
			<input name="percentageStart" value={keyframe.start_percentage} type="hidden" />
			<input name="percentageEnd" value={keyframe.end_percentage} type="hidden" />
		</div>

		<!-- @migration-task: migrate this slot by hand, `left button` is an invalid identifier -->
	<button slot="left button" class="py-4 text-rose-700" onclick={Reset} type="button"
			>Discard</button
		>
		<!-- @migration-task: migrate this slot by hand, `right button` is an invalid identifier -->
	<button slot="right button" class="py-4 disabled:text-slate-600" disabled={!canAdd}
			>{addButtonText}</button
		>
	</Modal>
</form>
