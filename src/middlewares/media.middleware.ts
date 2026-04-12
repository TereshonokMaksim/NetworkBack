import { NextFunction, Request, Response } from "express";
import multer, { memoryStorage } from "multer";
import { BadReqError } from "../errors/standartError";
import { join } from "node:path";
import { originalFilesDir, thumbnailFilesDir } from "../config/path";
import sharp from "sharp";


export const uploadMiddleware = multer({ storage: memoryStorage() });
export function processImageMiddleware(width: number, quality: number = 80) {
	return async function (req: Request, res: Response, next: NextFunction) {
		try {
			const file = req.file;
			if (!file) {
				next(new BadReqError("No uploaded image!"));
				return;
			}
			const filename = `${Date.now()}.jpeg`;
			const originalFilePath = join(originalFilesDir, filename);
			const thumbnailFilePath = join(thumbnailFilesDir, filename);

			await sharp(file.buffer)
				.jpeg({ quality: 100 })
				.toFile(originalFilePath);

			await sharp(file.buffer)
				.jpeg({ quality })
				.resize({ width })
				.toFile(thumbnailFilePath);
			file.filename = filename;

			next();
		} catch (error) {
			next(error);
		}
	};
}