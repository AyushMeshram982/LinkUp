import mongoose from "mongoose"
import { Event } from "../models/event.model.js"

async function removeUserCommentsFromEvents(USERID){

    await Event.updateMany(
        { "comments.userId": USERID },
        { $pull: { comments: { userId: USERID } } }
    )

}

export { removeUserCommentsFromEvents }