import { PrismaClientKnownRequestError } from "@prisma/client/runtime/wasm-compiler-edge";
import { InternalServerError, ValidationError } from "./standartError";

export function HandleDBError(error: unknown) {
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