import express, {Request, Response} from "express"
import cors from "cors"
import { ENV } from "../config/env"
import { UserRoutes } from "../modules/user/user.router"
import { uploadDir } from "../config/path"
import { AlbumRoutes } from "../modules/album/album.router"
import { PostRoutes } from "../modules/post/post.router"
import { TagRoutes } from "../modules/tag/tag.router"
import { SocialRoutes } from "../modules/social/social.router"


const app = express()
const HOST = ENV.HOST || "localhost"
const PORT = ENV.PORT || 3001

app.use(express.json())
// if (ENV.FRONT_ORIGIN){
app.use(cors())
// }
app.use("/users/", UserRoutes)
app.use("/albums/", AlbumRoutes)
app.use("/posts/", PostRoutes)
app.use("/tags/", TagRoutes)
app.use("/social/", SocialRoutes)
app.use("/media/", express.static(uploadDir));

app.get("/", (req: Request, res: Response) => {res.status(200).json({status: "OK", timestamp: Date.now()})})
setInterval(() => {
  console.log('tick', Date.now());
}, 2000);
app.listen(PORT, HOST, () => {
    console.log(`Server started on http://${HOST}:${PORT}`)
})

