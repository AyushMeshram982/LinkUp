import mongoose from "mongoose";
import { Event } from "./event.model.js";
import { Group } from "./group.model.js";
import { Resource } from "./resource.model.js";

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    city: {
        type: String, 
        required: true
    },

    profileImageUrl: {
        type: String
    },

    hostedEvents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],

    registeredEvents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],

    likedEvents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],

    joinedGroups: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group'
    }],

    postedResources: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resource'
    }],

    //following are for the case when user forgets their password
    resetPasswordOtp: {
        type: String
    },

    resetPasswordOtpExpires: {
        type: Date
    },

    resetPasswordToken: {
        type: String
    },

    resetPasswordTokenExpires: {
        type: Date
    }

})

const User = mongoose.model("User", userSchema);

export { User };
