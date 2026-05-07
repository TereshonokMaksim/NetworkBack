import { NextFunction, Request, Response } from "express";
import multer, { memoryStorage } from "multer";
import { BadReqError } from "../errors/standartError";
import { join } from "node:path";
import { originalFilesDir, thumbnailFilesDir } from "../config/path";
import sharp from "sharp";

async function saveImage(file: Express.Multer.File, filename: string, quality: number, width: number, additionalFolder: string | null, res: Response) {
    let filenameFull = `${filename}.jpeg`;
	if (additionalFolder){
		filenameFull = join(additionalFolder, filenameFull)
	}
	const originalFilePath = join(originalFilesDir, filenameFull);
	const thumbnailFilePath = join(thumbnailFilesDir, filenameFull);

export const uploadMiddleware = multer({ storage: memoryStorage() });
export function processImageMiddleware(width: number, quality: number = 80, required: boolean = false) {
	return async function (req: Request, res: Response, next: NextFunction) {
		try {
			const file = req.file;
			if (!file) {
				console.log("NO image found")
				if (required){
					next(new BadReqError("No uploaded image!"));
				}
				else {
					next()
				}
				return;
			}
			console.log("image found")
			const filename = `${Date.now()}.jpeg`;
			const originalFilePath = join(originalFilesDir, filename);
			const thumbnailFilePath = join(thumbnailFilesDir, filename);

}

export const uploadMiddleware = multer({ storage: memoryStorage() });
export function processImageMiddleware(
    width: number,
    quality: number = 80,
    required: boolean = false,
    single: boolean = false,
    additionalFolder: string | null = null,
) {
    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.files) {
                console.log("NOTHING found");
                if (required) {
                    next(new BadReqError("No uploaded media!"));
                } else {
                    next();
                }
                return;
            }
            let files: Express.Multer.File[] = [];
            if (Array.isArray(req.files)) {
                files = req.files;
            } else {
                for (let fileMap of Object.values(req.files)) {
                    files = [...files, ...fileMap];
                }
            }
            if (single) {
                const file = files[0];
                if (!file) {
                    console.log("NO image found");
                    if (required) {
                        next(new BadReqError("No uploaded image!"));
                    } else {
                        next();
                    }
                    return;
                }
                console.log("image found");
                saveImage(file, `${Date.now()}`, quality, width, additionalFolder, res);
            }
			else {
                res.locals.files = []
				let counter=0;
				let nameStart=Date.now()
				for (let file of files){
					counter++
					saveImage(file, `${nameStart}---${counter}`, quality, width, additionalFolder, res)
					const a = {filename: "", originalname: ""}
					if (additionalFolder){
						a.filename = `thumbnail/${additionalFolder}/${nameStart}---${counter}.jpeg`;
						a.originalname = `original/${additionalFolder}/${nameStart}---${counter}.jpeg`;
					}
					else {
						a.filename = `thumbnail/${nameStart}---${counter}.jpeg`;
						a.originalname = `original/${nameStart}---${counter}.jpeg`;
					}
					console.log("FILES", a)
                    res.locals.files.push(a)
				}
			}

            next();
        } catch (error) {
            next(error);
        }
    };
}
