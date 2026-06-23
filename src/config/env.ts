import { str, cleanEnv, num } from "envalid"
import { config } from "dotenv";
config();

export const ENV = cleanEnv(process.env, {
    DATABASE_URL: str(),
    DB_PASSWORD: str(),
    JWT_ACCESS_SECRET_KEY: str(),
    JWT_EXPIRES_IN: str(),
    HOST_EMAIL_ADDRESS: str(),
    HOST_EMAIL_PASSWORD: str(),
    HOST: str({default: "localhost"}),
    PORT: num({default: 8002}),
    FRONT_ORIGIN: str({default: ""})
})