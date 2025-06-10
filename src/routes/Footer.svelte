<script lang="ts">
	import type { Snippet } from 'svelte'
	import { LINKS } from '$lib/constants'
	import GithubLogo from 'virtual:icons/logos/github-icon'
</script>

<footer class="mt-6 grid grid-cols-1 justify-items-center gap-4 px-6">
	<ul class="contents flex-wrap justify-center gap-6 sm:flex">
		{@render link('/', home)}
		{@render link(LINKS.github, github)}
		{@render link(LINKS.buyMeACoffee, coffee)}
	</ul>

	<ul class="contents">
		{@render credit(books)}
		{@render credit(sounds)}
	</ul>
</footer>

<!-- Links -->
{#snippet home()}
	<img src="/favicon.png" alt="optiscape icon" class="aspect-square h-5" />
	Optiscape
{/snippet}

{#snippet github()}
	<GithubLogo style="fill: gray;" />
	GitHub
{/snippet}

{#snippet coffee()}
	<span>☕️</span>
	Support the site!
{/snippet}

<!-- Credit -->
{#snippet books()}
	Books provided by <a href={LINKS.standardEbooks} class="inline underline">Standard Ebooks</a>
{/snippet}

{#snippet sounds()}
	Sounds provided by <a href={LINKS.freesound} class="inline underline">Freesound</a>
{/snippet}

<!-- Wrappers -->
{#snippet link(href: string, content: Snippet)}
	<li class="flex items-center gap-1 hover:text-amber-900">
		<a {href} class="contents">
			{@render content()}
		</a>
	</li>
{/snippet}

{#snippet credit(content: Snippet)}
	<li class="text-slate-400 first:mt-6">
		<p class="contents">
			{@render content()}
		</p>
	</li>
{/snippet}
