<script lang="ts">
	interface Props {
		href: string;
		className?: string;
		id?: string;
		children?: import('svelte').Snippet;
	}

	let {
		href,
		className = '',
		id = '',
		children
	}: Props = $props();
</script>

<a {href} {id} class={`text-zinc-800/50 text-sm ${className}`}>
	{#if children}{@render children()}{:else}see all →{/if}
</a>

