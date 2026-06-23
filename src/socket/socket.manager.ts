import { Server as HttpServer } from "node:http";
import { Socket, Server as SocketIOServer } from "socket.io";
import type {
	ClientSocket,
	Event,
	EventAcknowledgement,
	EventName,
	EventPayload,
	SocketManagerContract,
} from "./socket.types";


export class SocketManager implements SocketManagerContract {
	private readonly _ioServer: SocketIOServer;
	private readonly events: Event<EventName>[];
	constructor(httpServer: HttpServer) {
		this._ioServer = new SocketIOServer(httpServer, {
			cors: {
				origin: "*",
			},
		});
		this.events = [];
	}
	initConnection(callback?: (socket: ClientSocket) => void) {
		this._ioServer.on("connection", (socket: ClientSocket) => {
			console.log("New client connected: ", socket.id);
			callback?.(socket);
			this.events.forEach((event) => {
				socket.on(
					event.name,
					(
						data: EventPayload<EventName>,
						ack?: EventAcknowledgement<EventName>,
					) => {
						event.callback(socket, data, ack);
					},
				);
			});
			socket.on("disconnect", () => {
				console.log("Client disconnected: ", socket.id);
			});
		});
	}
	useMiddleware(
		middleware: (socket: Socket, next: (error?: Error) => void) => void,
	) {
		this._ioServer.use(middleware);
	}
	addEvent<K extends EventName>(
		name: K,
		callback: (
			socket: ClientSocket,
			payload: EventPayload<K>,
			ack?: EventAcknowledgement<K>,
		) => void,
	) {
		this.events.push({ name, callback });
	}
	get ioServer() {
		return this._ioServer;
	}
}