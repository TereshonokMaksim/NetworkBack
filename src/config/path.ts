import { join } from "node:path";


export const uploadDir = join(__dirname, "../../media");
export const originalFilesDir = join(uploadDir, "./original");
export const thumbnailFilesDir = join(uploadDir, "./thumbnail");