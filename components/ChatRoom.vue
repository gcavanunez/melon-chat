<script setup lang="ts">
import PartySocket from "partysocket";
import { faker } from "@faker-js/faker";
import { format } from "date-fns";
import { createPayload, parseEvent } from "~/party/events";
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
				room
				<span
					class="rounded bg-gray-600 px-1.5 py-0.5 font-mono text-gray-50 shadow"
				>
					{{ room }}
				</span>
				Connected {{ users.size }}
			</div>
			<div class="hidden sm:block">
				me -
				<span :title="pk">{{ profile.name }}</span>
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
