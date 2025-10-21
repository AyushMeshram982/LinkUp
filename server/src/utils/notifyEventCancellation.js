import { Event } from "../models/event.model.js"
import { User } from "../models/user.model.js";
import { sendEmail } from "./emailService.js"
import mongoose from "mongoose"

const sendEventCancellationNotification = async (eventId, eventTitle, registeredAttendees) => {

    //1. getting list of user id's
    const userIds = registeredAttendees.map(r => r.userId);

    if(userIds.length === 0){
        console.log(`[Notification] Event ${eventTitle} had no registered attendees to notify.`);
        return;
    }

    //2. lookup all users to get their emails(project only the email field)
    const attendees = await User.find({ _id: { $in: userIds } }).select('email');

    const attendeeEmails = attendees.map(user => user.email);

    if(attendeeEmails.length === 0){
        return;
    }

    const subject = `URGENT: Event Cancellation Notice - ${eventTitle}`;
    const text = `The event "${eventTitle}" has been cancelled by the host. We apologize for any inconvenience.`;
    const html = `<p> We are sorry to inform you that the event <strong> ${eventTitle} </strong> has been Cancelled by the host. </p> <br> <p> We apologize for any inconvenience caused. </p>`

    //3. send email to all attendees
    await sendEmail({
        to: attendeeEmails.join(','), //send to all emails at once
        subject,
        text,
        html
    });

    console.log(`[Notification] Sending Cancellation email to ${attendeeEmails.length} users for event: ${eventTitle}`);

}

export { sendEventCancellationNotification }