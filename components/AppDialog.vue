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
				class="bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0 z-20"
			/>
			<DialogContent
				class="data-[state=open]:animate-contentShow fixed left-[50%] top-[50%] z-20 max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none"
			>
				<DialogTitle class="text-mauve12 m-0 text-[17px] font-semibold">
					Edit profile
				</DialogTitle>
				<DialogDescription
					class="text-mauve11 mb-5 mt-[10px] text-[15px] leading-normal"
				>
					Make changes to your profile here. Click save when you're
					done.
				</DialogDescription>
				<slot></slot>

				<DialogClose
					class="text-grass11 hover:bg-green4 focus:shadow-green7 absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
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
