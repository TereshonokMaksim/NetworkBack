// import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
// import { PrismaClient as PC } from "../generated/prisma";
// import { ENV } from "../config/env";


// const adapter = new PrismaBetterSqlite3({ url: ENV.DATABASE_URL });

// export const PrismaClient = new PC({
// 	adapter,
// });

// import { PrismaPg } from "@prisma/adapter-pg";
// import { PrismaClient as PC } from "../generated/prisma/client";
// import { Pool } from "pg";
// import { ENV } from "../config/env";

// const pool = new Pool({
//     connectionString: ENV.DATABASE_URL,
//     max: 6,
//     idleTimeoutMillis: 3000,
//     connectionTimeoutMillis: 5000,
//     keepAlive: true,
//     keepAliveInitialDelayMillis: 10000,
//     allowExitOnIdle: true,
// });

// pool.on("error", (err: Error) => {
//     console.error("Unexpected pool error", err);
// });

// const adapter = new PrismaPg(pool);

// export const PrismaClient = new PC({ adapter });

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient as PC } from "../generated/prisma";
import { ENV } from "../config/env";

const adapter = new PrismaPg(ENV.DATABASE_URL);

export const PrismaClient = new PC({ adapter });
