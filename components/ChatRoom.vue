<script setup lang="ts">
import PartySocket from "partysocket";
import { faker } from "@faker-js/faker";
import { format } from "date-fns";
import { createPayload, parseEvent } from "~/party/events";
// import { URL } from "ufo";
const props = defineProps<{
	room: string;
}>();

const room = props.room;

const body = ref("");
const messages = ref<
	{ id: string; content: string; user_id: string; created_at: string }[]
>([]);
const users = ref<Map<string, { id: string; name: string; avatar: string }>>(
	new Map(),
);

const groupedMessages = computed(() => {
	return messages.value.map((row) => {
		return {
			...row,
			user: users.value.get(row.user_id) || {
				name: "Not identified",
				id: "null_id",
				avatar: `https://ui-avatars.com/api/?name=left`,
			},
		};
	});
});

const sortedMessages = computed(() => {
	return groupedMessages.value.reduce(
		(acc, curr) => {
			const last = acc?.at(-1);
			// if (!last) {
			// 	acc.push({
			// 		messages: [
			// 			{
			// 				body: curr.content,
			// 				formated_date: curr.created_at,
			// 				uuid: curr.id,
			// 			},
			// 		],
			// 		user: {
			// 			avatar: curr.user.avatar,
			// 			id: curr.user.id,
			// 		},
			// 	});
			// }
			// is the last message from the user or from another
			if (last?.user.id === curr.user.id) {
				last.messages.push({
					body: curr.content,
					formated_date: format(new Date(curr.created_at), "hh:mm a"),
					uuid: curr.id,
				});
			} else {
				acc.push({
					messages: [
						{
							body: curr.content,
							formated_date: format(
								new Date(curr.created_at),
								"hh:mm a",
							),
							uuid: curr.id,
						},
					],
					user: {
						avatar: curr.user.avatar,
						id: curr.user.id,
					},
				});
			}

			return acc;
		},
		[] as {
			messages: { uuid: string; body: string; formated_date: string }[];
			user: {
				id: string;
				avatar: string;
			};
		}[],
	);
});
const profile = useLocalStorage("profile", {
	name: faker.person.firstName(),
});
const pk = ref("");
const user = computed(() => ({
	name: profile.value.name,
	avatar: `https://ui-avatars.com/api/?name=${profile.value.name}`,
	id: pk.value,
}));

const partySocket = ref<PartySocket | null>(null);

const config = useRuntimeConfig();

partySocket.value = new PartySocket({
	// host: "localhost:1999",
	host: config.public.party,
	room,
	query: {
		name: profile.value.name,
	},
});
pk.value = partySocket.value._pk;
partySocket.value.addEventListener("message", (event) => {
	if (!event.data) {
		return;
	}
	const res = parseEvent(event.data);
	if (res.event === "broadcast-connected-user") {
		console.log(res);
	}
	if (res.event === "broadcast-user") {
		console.log(res);
		users.value.set(res.payload.id, {
			...res.payload,
			avatar: `https://ui-avatars.com/api/?name=${res.payload.name}`,
		});
	}
	if (res.event === "broadcast-remove-user") {
		console.log(res);
		users.value.delete(res.payload.id);
	}
	if (res.event === "broadcast-message") {
		messages.value.push(res.payload);
	}
});

// partySocket.value.pre
onUnmounted(() => {
	if (partySocket.value) {
		partySocket.value.close();
	}
});

const submit = () => {
	partySocket.value?.send(
		createPayload({
			event: "send-message",
			payload: {
				content: body.value,
			},
		}),
	);
	body.value = "";
};
// console.log(config.app.cdnURL);
const url = useRequestURL();
const { copy } = useClipboard({
	source: url.href,
});

const copyRoom = () => {
	copy();
};
// *mutators
// update profile

// get message
</script>

<template>
	<div class="h-full bg-gray-950">
		<header class="flex h-10 items-center justify-between bg-white px-4">
			<!-- badge -->
			<!-- profile -> name -->
			<div>
				<!-- room -->
				<span class="relative inline-flex">
					<button
						class="inline-flex items-center divide-x divide-gray-700 rounded bg-gray-600 font-mono text-gray-50 shadow"
						@click="copyRoom"
					>
						<span class="flex items-center space-x-3 px-3 py-0.5">
							<span>{{ users.size }}</span>
						</span>
						<span class="flex items-center space-x-2 px-2 py-0.5">
							<span>{{ room }}</span>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="h-4 w-4"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
								/>
							</svg>
						</span>
					</button>
					<span
						class="absolute left-0 top-0 -ml-0.5 -mt-0.5 flex h-2 w-2"
					>
						<span
							class="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"
						></span>
						<span
							class="relative inline-flex h-2 w-2 rounded-full bg-sky-500"
						></span>
					</span>
				</span>
				<!-- Connected  -->
			</div>
			<div class="flex items-center">
				<button class="h-8 w-8 overflow-hidden rounded-full">
					<img :src="user.avatar" class="h-full w-full" />
				</button>
			</div>
		</header>
		<section class="flex h-[calc(100%-40px)] flex-col">
			<div class="flex-1 space-y-4 px-4 py-2 text-white">
				<!-- <div class="underline">thread</div> -->
				<!-- <div v-for="msg in groupedMessages" :key="msg.id">
					<div>{{ msg.content }}</div>
					by - {{ msg.user?.name }}
				</div> -->
				<ChatMessage
					v-for="(chunk, index) in sortedMessages"
					:key="index"
					class=""
					:message="chunk"
					:user="user"
				/>
			</div>
			<form @submit.prevent="submit">
				<div
					class="flex w-full items-center justify-center gap-x-4 border-t border-gray-700 px-4 py-4"
				>
					<span
						class="relative inline-block w-full before:absolute before:inset-px before:rounded-[calc(theme(borderRadius.md)-1px)] before:bg-white before:shadow after:pointer-events-none after:absolute after:inset-0 after:rounded-md after:ring-inset after:ring-transparent after:focus-within:ring-2 after:focus-within:ring-blue-500 before:dark:inset-0 before:dark:rounded-md before:dark:bg-transparent"
					>
						<input
							v-model="body"
							type="text"
							class="relative w-full appearance-none rounded-md border border-zinc-950/10 bg-transparent px-[calc(theme(padding.3)-1px)] py-[calc(theme(padding[1.5])-1px)] placeholder:text-zinc-500 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white sm:text-sm/6"
						/>
					</span>
					<button
						class="relative isolate inline-flex rounded-md border border-transparent bg-indigo-600/90 px-[calc(theme(padding.3)-1px)] py-[calc(theme(padding[1.5])-1px)] font-semibold text-white before:bg-indigo-500 before:shadow after:absolute after:inset-0 after:-z-10 after:rounded-[calc(theme(borderRadius.md)-1px)] after:shadow-[inset_0_1px_#ffffff26] after:hover:bg-white/10 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:before:-inset-px dark:before:rounded-md dark:before:border dark:before:border-white/5 dark:after:-inset-px dark:after:rounded-md sm:text-sm/6"
					>
						Send
					</button>
				</div>
			</form>
		</section>
	</div>
</template>
