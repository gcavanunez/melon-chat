<script setup lang="ts">
const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{
	(e: "update:modelValue", value: boolean): void;
}>();
const toggleState = computed({
	get() {
		return props.modelValue;
	},
	set(value) {
		emit("update:modelValue", value);
	},
});
</script>
<template>
	<PopoverRoot v-model:open="toggleState">
		<PopoverTrigger as-child>
			<slot name="trigger" />
		</PopoverTrigger>

		<PopoverPortal>
			<PopoverContent
				side="bottom"
				class="data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade w-24 rounded bg-white p-5 shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2)] will-change-[transform,opacity] focus:shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2),0_0_0_2px_theme(colors.violet7)]"
			>
				<slot />
			</PopoverContent>
		</PopoverPortal>
	</PopoverRoot>
</template>
