import { ChatController } from "./chat.controller";
import { Router } from "express";
import { authenticateMiddleware } from "../../middlewares/auth.middleware";
import { processImageMiddleware, uploadMiddleware } from "../../middlewares/media.middleware";
// import { uploadMiddleware, processImageMiddleware } from "../../middlewares/media.middleware";


export const ChatRoutes = Router();

ChatRoutes.post(
    "/message/",
    authenticateMiddleware,
    uploadMiddleware.array("media"),
    processImageMiddleware(300, 80, false, false, "messages"),
    ChatController.sendMessageWithImages
);
ChatRoutes.get("/messages/unread", authenticateMiddleware, ChatController.getUnreadData)
ChatRoutes.get("/messages/:chatId", authenticateMiddleware, ChatController.getAllMessagesByChat)
ChatRoutes.get("/personal/:userId", authenticateMiddleware, ChatController.openPersonalChat)
ChatRoutes.get("/personal", authenticateMiddleware, ChatController.getPersonalChats)
ChatRoutes.post("/messages/:msgId", authenticateMiddleware, ChatController.markMessage)
