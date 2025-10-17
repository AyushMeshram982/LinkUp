import express from "express"
import { requireAuth } from "../middlewares/requireAuth.js"
import upload from "../middlewares/upload.js"

const router = express.Router();

import { groups, createGroup, singleGroup, updateGroup, joinGroup, leaveGroup } from "../controllers/group.controllers.js"

// get all the groups
router.get("/", groups)

//create a new group
router.post("/", requireAuth, upload.single('groupImage'), createGroup)

//fetch a single group by Id
router.get("/:id", singleGroup)

//update group details
router.put("/:id", requireAuth, upload.single('groupImage'), updateGroup)

//A user joining a group
router.post("/:id/join", requireAuth, joinGroup)

//A user leaving the group
router.delete("/:id/leave", requireAuth, leaveGroup)

export default router