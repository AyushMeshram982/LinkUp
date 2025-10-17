import mongoose from "mongoose"
import { User } from "./user.model.js"

const groupSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },

    description: {
        type: String,
        required: true
    },

    groupImageUrl: {
        type: String,
        required: true
    },

    keywords: [{
        type: String,
        trim: true
    }],

    hostId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        index: true
    },

    primaryCity: {
        type: String,
        required: true
    },

    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    isPublic: {
        type: Boolean,
        default: true
    },

}, { timestamps: true })

const Group = mongoose.model("Group", groupSchema)

export { Group }