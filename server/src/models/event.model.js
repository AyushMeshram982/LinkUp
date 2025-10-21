import mongoose from "mongoose"
import { User } from "./user.model.js"

const eventSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    imageUrl: {
        type: String,
        required: true
    },

    hostId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true
    },

    city: {
        type: String,
        required: true
    },

    address: {
        type: String,
        required: true
    },

    keywords: [{
        type: String
    }],

    date: {
        type: Date,
        required: true
    },

    time: {
        type: String,
        required: true
    },

    isPaid: {
        type: Boolean,
        default: false
    },

    price: {
        type: Number
    },

    hours: {
        type: Number
    },

    totalSeats: {
        type: Number,
        required: true
    },

    registeredAttendees: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        seats: {
            type: Number,
            required: true,
            min: 1
        }

    }],

    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    comments: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            index: true
        },
        text: {
            type: String
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],

    isCancelled: {
        type: Boolean,
        default: false
    },

    //QR Code Check-in Fields
    qrCheckinToken: {
        type: String,
        unique: true,
        spare: true    //Allows null values, as not all events will have a QR token immediately
    },

    qrTokenExpires: {
        type: String
    },

    qrCodeUrl: {
        type: String
    }

})

const Event = mongoose.model("Event", eventSchema);

export { Event }