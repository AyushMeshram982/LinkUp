import mongoose from "mongoose";
import { User } from "./user.model.js";
import { Event } from "./event.model.js";

const resourceSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    resourceImageUrl: {
        type: String,
        required: true
    },

    hostId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true
    },

    contactNumber: {
        type: String,
        required: true
    },

    linkedEventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },

    city: {
        type: String,
        required: true
    },

    neededDate: {
        type: Date,
        required: true
    },

    //is the resource still needed or someone has fulfilled it
    isStillNeeded: {
        type: Boolean,
        default: true
    }

})

const Resource = mongoose.model("Resource", resourceSchema)

export { Resource }