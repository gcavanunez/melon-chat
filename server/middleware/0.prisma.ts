/**
 * Fetch all `examples` from the database. Run `npx prisma db push` at least once for this to work.
 *
 * If you are using `tRPC` you can access the prisma-client by adding it to the context:
 * ```ts
 * export async function createContext(event: H3Event) {
 *   return { prisma: event.context.prisma }
 * }
 *
 * export type Context = inferAsyncReturnType<typeof createContext>
 * ```
 */
// export default defineEventHandler((event) =>
// 	event.context.prisma.example.findMany(),
// );

import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

declare module "h3" {
	interface H3EventContext {
		prisma: PrismaClient;
	}
}

export default eventHandler((event) => {
	if (!prisma) {
		prisma = new PrismaClient();
	}
	event.context.prisma = prisma;
});
