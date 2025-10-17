import express from "express"
import { requireAuth } from "../middlewares/requireAuth.js"
import upload from "../middlewares/upload.js"

const router = express.Router()

import { Events, createEvent, singleEvent, updateEvent, deleteEvent, RegisterUserForEvent, likeEvent, comment } from "../controllers/event.controllers.js"

// get all the events
router.get("/", Events)

// create / post a new event
router.post("/", requireAuth, upload.single('eventImage'), createEvent)

//get a single event
router.get("/:id", singleEvent)

//update or cancel the event
router.put("/:id", requireAuth, upload.single("eventImage"), updateEvent)

//delete the event
router.delete("/:id", deleteEvent)

//Register a user for an event (updates registeredAttendees)
router.post("/:id/register", requireAuth, RegisterUserForEvent)

//when user likes an event
router.post("/:id/like", requireAuth, likeEvent)

// Add a comment to the event
router.post("/:id/comment", requireAuth, comment)

export default router