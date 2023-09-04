<script setup lang="ts">
definePageMeta({
	validate: (route) => {
		return !!Object.keys(route.params).length;
	},
});

const route = useRoute("rooms-room");
const room = route.params.room;
</script>

<template>
	<ClientOnly>
		<ChatRoom :room="room" />
	</ClientOnly>
</template>
