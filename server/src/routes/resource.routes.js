import express from "express"
import { requireAuth } from "../middlewares/requireAuth.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

import { resources, postResource, singleResource, updateResource, deleteResource } from "../controllers/resource.controllers.js"

// get all the resources
router.get("/", resources)

//post a new resource
router.post("/", requireAuth, upload.single('resourceImage'), postResource) 

//get a single Resource page
router.get("/:id", singleResource)

//update the resource
router.put("/:id", requireAuth, upload.single('resourceImage'), updateResource)

//delete the resource
router.delete("/:id", requireAuth, deleteResource)

export default router