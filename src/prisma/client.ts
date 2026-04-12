import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient as PC } from "../generated/prisma";
import { ENV } from "../config/env";


const adapter = new PrismaBetterSqlite3({ url: ENV.DATABASE_URL });

export const PrismaClient = new PC({
	adapter,
});