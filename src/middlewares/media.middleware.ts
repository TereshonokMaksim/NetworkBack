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
    file.filename = filenameFull
	const originalFilePath = join(originalFilesDir, filenameFull);
	const thumbnailFilePath = join(thumbnailFilesDir, filenameFull);

    await sharp(file.buffer).jpeg({ quality: 100 }).toFile(originalFilePath);
    await sharp(file.buffer).jpeg({ quality }).resize({ width }).toFile(thumbnailFilePath);

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
            
            let files: Express.Multer.File[] = [];
            if (!single){
                if (!req.files) {
                    console.log("NOTHING found");
                    if (required) {
                        next(new BadReqError("No uploaded media!"));
                    } else {
                        next();
                    }
                    return;
                }
                if (Array.isArray(req.files)) {
                    files = req.files;
                } else {
                    for (let fileMap of Object.values(req.files)) {
                        files = [...files, ...fileMap];
                    }
                }
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
                    res.locals.files.push(a)
				}
            }
            else {
                const file = req.file;
                if (!file) {
                    console.log("NO image found");
                    if (required) {
                        next(new BadReqError("No uploaded image!"));
                    } else {
                        next();
                    }
                    return;
                }
                // files = [file]
                req.file = file
                console.log("image found");
                saveImage(file, `${Date.now()}`, quality, width, additionalFolder, res);
            }

            next();
        } catch (error) {
            next(error);
        }
    };
}
