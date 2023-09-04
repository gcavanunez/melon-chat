<script lang="ts" setup>
import { customAlphabet } from "nanoid";
const nanoid = customAlphabet("123456789abcdefg", 3);
const rotuer = useRouter();
rotuer.push({
	name: "rooms-room",
	params: {
		room: nanoid() + "-" + nanoid(),
	},
});
</script>
<template>
	<div></div>
</template>
