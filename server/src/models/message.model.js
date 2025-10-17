import mongoose from "mongoose"
import { Group } from "./group.model.js"
import { User } from "./user.model.js"

const messageSchema = new mongoose.Schema({

    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },

    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    text: {
        type: String,
        required: true,
    },

    mediaUrl: {
        type: String,
        default: null
    }

}, { timestamps: true })

//Creating an index on groupId for fast message retrival
messageSchema.index({ groupId: 1, createdAt: 1 })

const Message = mongoose.model("Message", messageSchema);

export { Message };