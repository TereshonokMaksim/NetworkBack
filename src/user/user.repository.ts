import { UserRepositoryContract } from "./types/user.contracts";
import type {
	UserWithPassword,
	User,
	UserCreateInput,
} from "./types/user.types";
import { PrismaClient } from "../prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { ValidationError, InternalServerError } from "../errors/standartError";


export const UserRepository: UserRepositoryContract = {
	async findByEmailWithPassword(
		email: string,
	): Promise<UserWithPassword | null> {
		try {
			return await PrismaClient.user.findFirst({
				where: {
					email: email,
				},
			});
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				if (
					["P2000", "P2005", "P2006", "P2007", "P2009"].includes(
						error.code,
					)
				) {
					console.log("Wrong query passed by user.");
					throw new ValidationError("WRONG_QUERY");
				}
				if (error.code === "P2022")
					console.log("DB error. Check migrations.");
				throw new InternalServerError("WRONG_DATABASE");
			}
		}
		throw new InternalServerError("UNHANDLED_DB_EXCEPTION");
	},
	async findByEmail(email: string): Promise<User | null> {
		try {
			return await PrismaClient.user.findFirst({
				where: {
					email: email,
				},
				omit: {
					password: true,
				},
			});
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				if (
					["P2000", "P2005", "P2006", "P2007", "P2009"].includes(
						error.code,
					)
				) {
					console.log("Wrong query passed by user.");
					throw new ValidationError("WRONG_QUERY");
				}
				if (error.code === "P2022") {
					console.log("DB error. Check migrations.");
					throw new InternalServerError("WRONG_DATABASE");
				}
			}
			throw new InternalServerError("UNHANDLED_DB_EXCEPTION");
		}
	},
	async create(data: UserCreateInput): Promise<User> {
		try {
            console.log(data, "data")
			return await PrismaClient.user.create({ data });
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === "P2011") {
					console.log(
						"Service didn't pass enough values for create User",
					);
					throw new ValidationError("NOT_ENOUGH_VALUES");
				}
				if (error.code === "P2002") {
					console.log(
						"You dont need to provide id, prisma can think of it by itself",
					);
					throw new ValidationError("TOO_MUCH_VALUES");
				}
				if (["P2000", "P2005", "P2006", "P2007"].includes(error.code)) {
					console.log("Wrong query passed by user.");
					throw new ValidationError("WRONG_QUERY");
				}
				if (error.code === "P2022") {
					console.log("DB error. Check migrations.");
					throw new InternalServerError("WRONG_DATABASE");
				}
			}
			throw new InternalServerError("UNHANDLED_DB_EXCEPTION");
		}
	},
    async modify(userId, newData) {
        try{
            return await PrismaClient.user.update({
                where: { id: userId },
                data: newData,
                omit: {password: true}
            })
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				if (
					["P2000", "P2005", "P2006", "P2007", "P2009"].includes(
						error.code,
					)
				) {
					console.log("Wrong query passed by user.");
					throw new ValidationError("WRONG_QUERY");
				}
				if (error.code === "P2022") {
					console.log("DB error. Check migrations.");
				}
				throw new InternalServerError("WRONG_DATABASE");
			}
			throw new InternalServerError("UNHANDLED_DB_EXCEPTION");
		}
    },
	async findById(id: number): Promise<User> {
		try {
            // Unsure if error handling will work without await
			return await PrismaClient.user.findFirstOrThrow({
				where: { id },
				omit: {
					password: true,
				},
			});
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				if (
					["P2000", "P2005", "P2006", "P2007", "P2009"].includes(
						error.code,
					)
				) {
					console.log("Wrong query passed by user.");
					throw new ValidationError("WRONG_QUERY");
				}
				if (error.code === "P2022") {
					console.log("DB error. Check migrations.");
				}
				throw new InternalServerError("WRONG_DATABASE");
			}
			throw new InternalServerError("UNHANDLED_DB_EXCEPTION");
		}
	},
};