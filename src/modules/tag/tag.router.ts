import { Router } from "express";
import { TagController } from "./tag.controller";


export const TagRoutes = Router()

TagRoutes.post("/", TagController.createTag)
TagRoutes.get("/", TagController.getAllTags)
TagRoutes.get("/:id", TagController.getTagById)