<script setup lang="ts">
import {
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogOverlay,
	DialogPortal,
	DialogRoot,
	DialogTitle,
	DialogTrigger,
} from "radix-vue";
const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{
	(e: "update:modelValue", value: boolean): void;
}>();

const value = computed({
	get() {
		return props.modelValue;
	},
	set(value) {
		emit("update:modelValue", value);
	},
});
</script>

<template>
	<!-- class="text-grass11 shadow-blackA7 hover:bg-mauve3 inline-flex h-[35px] items-center justify-center rounded-[4px] bg-white px-[15px] font-semibold leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none" -->
	<!-- Edit profile -->
	<DialogRoot v-model:open="value">
		<DialogTrigger as-child>
			<slot name="trigger" />
		</DialogTrigger>
		<DialogPortal>
			<DialogOverlay
				class="fixed inset-0 z-20 bg-blackA9 data-[state=open]:animate-overlayShow"
			/>
			<DialogContent
				class="fixed left-[50%] top-[70%] z-20 max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-gray-900 p-[25px] shadow-lg ring-1 ring-white/20 focus:outline-none data-[state=open]:animate-contentShow sm:top-[50%]"
			>
				<DialogTitle class="m-0 text-[17px] font-semibold text-mauve1">
					Edit profile
				</DialogTitle>
				<DialogDescription
					class="mb-5 mt-[10px] text-[15px] leading-normal text-mauve8"
				>
					Make changes to your profile here. Click save when you're
					done.
				</DialogDescription>
				<slot></slot>

				<DialogClose
					class="absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full text-mauve2 hover:bg-mauve11 focus:shadow-[0_0_0_2px] focus:shadow-mauve5 focus:outline-none"
					aria-label="Close"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="h-6 w-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</DialogClose>
			</DialogContent>
		</DialogPortal>
	</DialogRoot>
</template>
