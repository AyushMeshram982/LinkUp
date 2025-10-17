import mongoose from "mongoose"
import { Message } from "../models/message.model.js"

async function changeMessageSenderId (userId){

    const ADMIN_ID = "65e69d77639f75a6c11b06c13";

    await Message.updateMany(
        { senderId: userId },
        { $set: { senderId: new mongoose.Types.ObjectId(ADMIN_ID) } }
    );

}

export { changeMessageSenderId }