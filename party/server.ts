/// <reference no-default-lib="true"/>
/// <reference types="@cloudflare/workers-types" />

import {
	PartyKitServer,
	Party,
	PartyConnectionContext,
	PartyRequest,
} from "partykit/server";
import { nanoid } from "nanoid";
import { createPayload, parseEvent } from "./events";
export default {
	async onConnect(connection, party: Party, ctx: PartyConnectionContext) {
		// `connection` is a WebSocket object, but with a few extra properties
		// and methods. See the PartyKitConnection type for more details.
		// connection.send("Hello, world!"); // Send a message to the client

		connection.addEventListener("message", (event) => {
			console.info(event.data); // Log a message from the client
			const payload = parseEvent(event.data);
			if (payload.event === "send-message") {
				const safeData = payload.payload;
				const pong = createPayload({
					event: "broadcast-message",
					payload: {
						content: safeData.content,
						user_id: connection.id,
						created_at: new Date().toISOString(),
						id: nanoid(),
					},
				});
				party.broadcast(pong);
			}
			if (payload.event === "update-profile") {
				const safeData = payload.payload;
				party.storage.put(connection.id, {
					name: safeData.name,
				});
				const pong = createPayload({
					event: "broadcast-user",
					payload: {
						name: safeData.name,
						id: connection.id,
					},
				});
				party.broadcast(pong);
			}

			// Log a message from the client
		});
		connection.addEventListener("close", () => {
			party.storage.delete(connection.id);
			// room.storage.deleteAll();
			const pong = createPayload({
				event: "broadcast-remove-user",
				payload: {
					id: connection.id,
				},
			});
			party.broadcast(pong);
			console.info("closed");
		});

		// everyone already connected needs to get the new user
		const name = new URLSearchParams(
			new URL(ctx.request.url).searchParams,
		).get("name");
		party.storage.put(connection.id, {
			name,
		});

		for (const conn of party.getConnections()) {
			const person = await party.storage.get<{ name: string }>(conn.id);
			if (!person) {
				return;
			}
			const pong = createPayload({
				event: "broadcast-user",
				payload: {
					name: person.name,
					id: conn.id,
				},
			});
			party.broadcast(pong);
		}
	},
	onRequest(_req: PartyRequest, party: Party) {
		// ...
		console.info(party.env);

		// console.info(process.env.WHATUP);
		console.info(party.context.parties);
		// const res = await room.parties.xyz.get("some-id").fetch();
		// console.info("gottt", await res.text());
		// const wssss = room.parties.xyz.get("some-id").connect();
		// room.addEventListener("message", (evt) => {
		// 	console.info("got a message from xyz", evt.data);
		// });

		// console.info(SOME_GLOBAL);
		party.broadcast("Yoo from");
		return new Response("Hello world:" + party.id);
		// s
	},
} satisfies PartyKitServer;

// const decoder = new TextDecoder();
// function parseEvent<T>(data: string | ArrayBuffer) {
// 	const dataString = typeof data === "string" ? data : decoder.decode(data);
// 	const step = JSON.parse(dataString);
// 	return step as T;
// }
// const encode = (data: any) => JSON.stringify(data);
