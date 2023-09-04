<script setup lang="ts">
defineProps<{
	message: {
		messages: { uuid: string; body: string; formated_date: string }[];
		user: {
			id: string;
			avatar: string;
		};
	};
	user: {
		id: string;
		avatar: string;
	};
}>();
</script>

<template>
	<div class="chat-message">
		<div
			class="flex items-end"
			:class="[message.user.id === user.id ? 'justify-end' : '']"
		>
			<div
				class="flex max-w-xs flex-col items-start space-y-2 pl-2 pr-2 text-xs"
				:class="[
					message.user.id === user.id
						? 'order-1 items-end'
						: 'order-2 items-start',
				]"
			>
				<div
					v-for="(message_row, index) in message.messages"
					:key="message_row.uuid"
					class="group relative flex w-full"
					:class="[
						message.user.id === user.id
							? 'justify-end'
							: 'justify-start',
					]"
				>
					<div
						class="flex gap-x-2"
						:class="[
							message.user.id === user.id
								? 'flex-row-reverse'
								: 'flex-row',
						]"
					>
						<span
							class="relative inline-block w-auto max-w-full rounded-lg px-4 py-2"
							style="
								white-space: break-spaces;
								word-wrap: break-word;
								text-indent: 0;
							"
							:class="[
								message.user.id === user.id
									? 'bg-blue-600 text-white'
									: 'bg-gray-300 text-gray-700',
								message.messages.length - 1 === index &&
								message.user.id === user.id
									? 'rounded-br-none'
									: '',
								message.messages.length - 1 === index &&
								message.user.id !== user.id
									? 'rounded-bl-none'
									: '',
							]"
							>{{ message_row.body }}
							<div
								style="font-size: 11px; line-height: 15px"
								class="flex text-opacity-75"
								:class="[
									message.user.id === user.id
										? 'justify-end text-gray-200'
										: 'justify-start text-gray-600',
								]"
							>
								{{ message_row.formated_date }}
							</div>
						</span>
						<div
							class="opacity-0 transition focus-within:opacity-100 group-hover:opacity-100"
						></div>
					</div>
				</div>
			</div>
			<img
				:src="message.user.avatar"
				alt="My profile"
				class="h-6 w-6 transform rounded-full object-cover transition-all"
				:class="[message.user.id === user.id ? 'order-2' : 'order-1']"
			/>
		</div>
	</div>
</template>
