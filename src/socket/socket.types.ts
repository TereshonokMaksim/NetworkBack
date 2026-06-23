import type { Socket, Server as SocketIOServer } from "socket.io";
import type {
	ChatClientEvents,
	ChatServerEvents,
} from "../modules/chat/types/chat.contracts";
import type { UserClientEvents, UserServerEvents } from "../modules/user/types/user.contracts";

// События, которые сервер может отправлять клиенту
export interface AppServerEvents extends ChatServerEvents, UserServerEvents {}
// События, которые клиент может отправлять серверу
export interface AppClientEvents
	extends ChatClientEvents, UserClientEvents {}

export interface AuthenticatedSocket {
	userId: number;
}

export type ClientSocket = Socket<
	AppClientEvents,
	AppServerEvents,
	object,
	AuthenticatedSocket
>;

export type ServerSocket = SocketIOServer<
	AppClientEvents,
	AppServerEvents,
	object,
	AuthenticatedSocket
>;

export type EventName = keyof AppClientEvents;

export type EventPayload<K extends EventName> = Parameters<
	AppClientEvents[K]
>[0];
export type EventAcknowledgement<K extends EventName> = Parameters<
	AppClientEvents[K]
>[1];
export interface Event<K extends EventName> {
	name: K;
	callback: (
		socket: ClientSocket,
		payload: EventPayload<K>,
		ack?: EventAcknowledgement<K>,
	) => void;
}

export interface SocketManagerContract {
	initConnection(callback?: (socket: ClientSocket) => void): void;
	useMiddleware(
		middleware: (socket: Socket, next: (error?: Error) => void) => void,
	): void;
	addEvent<K extends EventName>(
		name: K,
		callback: (
			socket: ClientSocket,
			payload: EventPayload<K>,
			ack?: EventAcknowledgement<K>,
		) => void,
	): void;
	ioServer: ServerSocket;
}

export interface SocketController {
	registerHandlers: (socketManager: SocketManagerContract) => void;
}