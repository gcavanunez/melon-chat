<script setup lang="ts">
import PartySocket from "partysocket";
import { createPayload } from "@/party/events";

const partySocket = ref<PartySocket | null>(null);
const messages = ref<string[]>([]);

type User = {
	id: string;
	name: string;
	avatar: string;
};

type Message = {
	messages: Message;
	user: User;
	id: string;
	content: string;
	timestamp: Date;
};
const encode = (data: any) => JSON.stringify(data);

// 1. get a nmae or random name
// 2. re-direct them to some new room
// 3. await folk connected

onMounted(() => {
	partySocket.value = new PartySocket({
		host: "localhost:1999",
		// host: "testy.threepointone.partykit.dev",
		room: "some-room",
		query: { name: "bob" },
	});
	partySocket.value.addEventListener("message", (e) => {
		console.log(e.data);
		if (e.data) {
			messages.value.push(String(e.data));
		}
	});

	// partySocket.value.pre
});
onUnmounted(() => {
	if (partySocket.value) {
		partySocket.value.close();
	}
});
const loading = ref(true);
const user = ref({
	name: "Bob",
	avatar: "https://ui-avatars.com/api/?name=Bob",
});
const body = ref("");
const sortedMessages = computed([]);
const submit = () => {
	partySocket.value?.send(
		encode(
			createPayload({
				event: "send-message",
				payload: {
					content: body.value,
				},
			}),
		),
	);
	// partySocket.value?.send("Hello there");
};
const updateName = () => {
	partySocket.value?.send(
		encode(
			createPayload({
				event: "update-profile",
				payload: {
					name: user.value.name,
				},
			}),
		),
	);
};
</script>
<template>
	<div>
		<div class="mx-auto my-10">
			<div class="bg-white p-4 shadow">
				<form @submit.prevent="updateName">
					<input v-model="user.name" />
					<button type="submit">save</button>
				</form>
			</div>
		</div>
		<div class="flex h-screen flex-col items-end bg-white">
			<div
				class="tw-h-full relative mr-4 mt-16 flex w-96 flex-1 flex-col overflow-hidden rounded-lg bg-white shadow-xl"
			>
				<div class="w-full rounded-t-lg bg-blue-500">
					<div class="flex items-center space-x-2 px-4 py-5">
						<div class="">
							<button
								fab
								x-small
								class="text--white normal-case shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-4 w-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M15 19l-7-7 7-7"
									/>
								</svg>
							</button>
						</div>
						<!-- px-4  -->
						<div
							class="relative flex flex-1 items-center space-x-3"
						>
							<div class="flex-shrink-0">
								<img
									class="h-10 w-10 rounded-full"
									alt=""
									src="https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=facearea&w=256&h=256&facepad=2"
								/>
							</div>
							<div class="min-w-0 flex-1">
								<a href="#" class="focus:outline-none">
									<span
										class="absolute inset-0"
										aria-hidden="true"
									/>
									<p
										class="mb-0 text-sm font-medium text-gray-50"
									>
										First name, last name
									</p>
								</a>
							</div>
							<div></div>
						</div>
					</div>
				</div>
				<transition name="fade-transition" mode="out-in">
					<div
						v-if="!loading"
						id="messages"
						ref="scrollToMe"
						class="scrolling-touch scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 flex flex-1 flex-col overflow-y-scroll"
					>
						<div
							v-for="(group, index) in sortedMessages"
							:key="index"
							class="relative"
						>
							<div
								class="sticky top-0 z-10 border-b border-t border-gray-200 bg-gray-50 px-4 py-1 text-sm font-medium text-gray-500"
							>
								<h3>{{ index }}</h3>
							</div>
							<div class="space-y-4 p-4">
								<!-- <transition-group name="fade-transition" class="space-y-4 p-4"> -->
								<!-- <ChatConversationMessage
					  v-for="message in group"
					  :key="message.id"
					  :message="message"
					  :user="user"
					/> -->
								<!-- </transition-group> -->
							</div>
						</div>
					</div>
					<div
						v-else
						class="scrolling-touch scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 flex flex-1 flex-col overflow-y-scroll"
					>
						<!-- <v-progress-linear indeterminate color="primary darken-2" /> -->
					</div>
				</transition>
				<div class="border-t-2 border-gray-200 px-4 pb-2 pt-2 sm:mb-0">
					<form @submit.prevent="submit">
						<div class="relative flex space-x-2">
							<textarea
								v-model="body"
								class="max-h-64 w-full overflow-y-auto rounded-lg border"
								rows="1"
								@keydown.enter.exact.prevent
								@keyup.enter.exact="submit"
							/>
							<div class="items-end sm:flex">
								<button
									type="submit"
									class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white transition duration-500 ease-in-out hover:bg-blue-400 focus:outline-none focus:ring focus:ring-white"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 20 20"
										fill="currentColor"
										class="h-5 w-5 rotate-90 transform"
									>
										<path
											d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"
										/>
									</svg>
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>
			<div
				class="m-4 flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-blue-600 shadow-xl"
			>
				<svg
					class="h-6 w-6 text-white"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 9l-7 7-7-7"
					></path>
				</svg>
			</div>
		</div>
	</div>
</template>
