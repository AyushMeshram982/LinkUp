import { User } from "../models/user.model.js";
import { Event } from "../models/event.model.js";
import mongoose from "mongoose"

async function removeLikes(userId){

    const user = await User.findById(userId).select('likedEvents');

    //safety check - if user not found or no liked events
    if(!user || user.likedEvents === 0){
        return;
    }

    const likedEvents = user.likedEvents;

    await Event.updateMany({ _id: { $in: likedEvents } }, { $pull: { likes: userId } })

}

export { removeLikes }