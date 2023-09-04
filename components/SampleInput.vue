<template>
	<div
		class="flex w-full items-center justify-center gap-x-4 border-t border-gray-700 py-4"
	>
		<span
			class="relative inline-block before:absolute before:inset-px before:rounded-[calc(theme(borderRadius.md)-1px)] before:bg-white before:shadow after:pointer-events-none after:absolute after:inset-0 after:rounded-md after:ring-inset after:ring-transparent after:focus-within:ring-2 after:focus-within:ring-blue-500 before:dark:inset-0 before:dark:rounded-md before:dark:bg-transparent"
		>
			<input
				v-model="text"
				type="text"
				class="relative appearance-none rounded-md border border-zinc-950/10 bg-transparent px-[calc(theme(padding.3)-1px)] py-[calc(theme(padding[1.5])-1px)] text-sm/6 placeholder:text-zinc-500 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
			/>
		</span>
		<button
			class="relative isolate inline-flex rounded-md border border-transparent bg-indigo-600/90 px-[calc(theme(padding.3)-1px)] py-[calc(theme(padding[1.5])-1px)] text-sm/6 font-semibold text-white before:bg-indigo-500 before:shadow after:absolute after:inset-0 after:-z-10 after:rounded-[calc(theme(borderRadius.md)-1px)] after:shadow-[inset_0_1px_#ffffff26] after:hover:bg-white/10 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:before:-inset-px dark:before:rounded-md dark:before:border dark:before:border-white/5 dark:after:-inset-px dark:after:rounded-md"
		>
			Send
		</button>
	</div>
</template>

<script setup></script>
