import { join } from "node:path";


const uploadDir = join(__dirname, "../../media");
export const originalFilesDir = join(uploadDir, "./original");
export const thumbnailFilesDir = join(uploadDir, "./thumbnail");