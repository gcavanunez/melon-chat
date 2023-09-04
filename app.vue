<script setup lang="ts">
// import { useDark } from "@vueuse/core";

useServerSeoMeta({
	ogSiteName: "melon-chat.vercel.app",
	twitterSite: "@gcavanunez",
});
useServerHead({
	htmlAttrs: {
		lang: "en",
	},
});
// useDark({
// 	writeDefaults: true,
// });
</script>
<template>
	<div class="h-full">
		<NuxtPage />
	</div>
</template>
