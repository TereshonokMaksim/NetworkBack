import express from "express"
import cors from "cors"
import { ENV } from "../config/env"
import { UserRoutes } from "../user/user.router"


const app = express()
const HOST = ENV.HOST || "localhost"
const PORT = ENV.PORT || 3001

app.use(express.json())
// if (ENV.FRONT_ORIGIN){
app.use(cors())
// }
app.use("/users/", UserRoutes)

app.listen(PORT, HOST, () => {
    console.log(`Server started on http://${HOST}:${PORT}`)
})

