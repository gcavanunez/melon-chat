import * as z from "zod";

export const EventsValidators = {
	"update-profile": z.object({
		name: z.string(),
	}),
	"send-message": z.object({
		content: z.string(),
	}),
	"broadcast-message": z.object({
		content: z.string(),
		user_id: z.string(),
		created_at: z.string(),
		id: z.string(),
	}),
	"broadcast-user": z.object({
		name: z.string(),
		id: z.string(),
	}),
	"broadcast-connected-user": z.object({
		id: z.string(),
	}),
	"broadcast-remove-user": z.object({
		id: z.string(),
	}),
};

export type MessageTypes = keyof typeof EventsValidators;
export type MessageDataCompleteType<T extends MessageTypes> = z.infer<
	(typeof EventsValidators)[T]
>;

type EventBus = {
	[Key in MessageTypes]: {
		event: Key;
		payload: MessageDataCompleteType<Key>;
	};
}[MessageTypes];

const encode = (data: any) => JSON.stringify(data);

export const createPayload = <T extends MessageTypes>(payload: {
	event: T;
	payload: MessageDataCompleteType<T>;
}) => encode(payload);

const decoder = new TextDecoder();
export function parseEvent(data: string | ArrayBuffer): EventBus {
	const dataString = typeof data === "string" ? data : decoder.decode(data);
	const mapEvent: {
		event: MessageTypes;
		payload: unknown;
	} = JSON.parse(dataString);
	return {
		event: mapEvent.event,
		payload: EventsValidators[mapEvent.event].parse(mapEvent.payload),
	} as EventBus;
}
