import express, {Request, Response} from "express"
import cors from "cors"
import { ENV } from "../config/env"
import { SocketManager } from "../socket";
import { UserRoutes } from "../modules/user/user.router"
import { uploadDir } from "../config/path"
import { AlbumRoutes } from "../modules/album/album.router"
import { PostRoutes } from "../modules/post/post.router"
import { TagRoutes } from "../modules/tag/tag.router"
import { SocialRoutes } from "../modules/social/social.router"
import { ChatRoutes } from "../modules/chat/chat.router";
import { createServer } from "node:http";
import { MessageSocketController } from "../modules/chat/chat.socket.controller";
import { authenticateSocketMiddleware } from "../middlewares/authenticate.middleware";
import { startTunnel } from "../config/db.tunnel";
import { logMiddleware } from "../middlewares/log.middleware";
import { UserSocketController } from "../modules/user/user.socket.controller";


const app = express()

const httpServer = createServer(app);

export const socketManager = new SocketManager(httpServer);
const HOST = ENV.HOST || "localhost"
const PORT = ENV.PORT || 3001

app.use(express.json())
// if (ENV.FRONT_ORIGIN){
app.use(cors())
app.use(logMiddleware)
// }
app.use("/users/", UserRoutes)
app.use("/albums/", AlbumRoutes)
app.use("/posts/", PostRoutes)
app.use("/tags/", TagRoutes)
app.use("/social/", SocialRoutes)
app.use("/chats/", ChatRoutes)
app.use("/media/", express.static(uploadDir));

app.get("/", (req: Request, res: Response) => {res.status(200).json({status: "OK", timestamp: Date.now()})})

socketManager.initConnection((socket) => {
	socket.join("user:" + socket.data.userId);
	console.log(`User ${socket.data.userId} connected to WebSocket`);
	socket.on("disconnect", () => {
		socket.leave("user:" + socket.data.userId);
		UserSocketController.userDisconnect(
			socketManager.ioServer, 
			socket,
			{}
		)
	});
});
socketManager.useMiddleware(authenticateSocketMiddleware);
MessageSocketController.registerHandlers(socketManager)
UserSocketController.registerHandlers(socketManager)
app.set("ioServer", socketManager.ioServer)

const tickSecondInterval: number = 5
let lastTickTime = Date.now()
function tick() {
	const curDate = new Date()
	const curTime = Date.now()
	function fillStart(num: number){
		return `${String(num).length === 1 ? "0" : ""}${num}`
	}
	console.log(`[TICK] ${curTime} | ${fillStart(curDate.getHours())}:${fillStart(curDate.getMinutes())}:${fillStart(curDate.getSeconds())} ${curDate.getDate()}.${curDate.getMonth()+1}.${curDate.getFullYear()} | OFFSET: ${Math.abs(Math.round((curTime - lastTickTime)) - tickSecondInterval * 1000)}ms`)
	lastTickTime = curTime
}

async function bootstrap(){
    try {
        // await startTunnel() 
		setInterval(() => {
			tick()
		}, tickSecondInterval * 1000);
		httpServer.listen(PORT, HOST, () => {
			console.log(`Server is started on: http://${HOST}:${PORT}`);
			console.log(`WS Server is started on: ws://${HOST}:${PORT}`);
		});

    } catch (error) {
        console.error(error)
    }
}
bootstrap()