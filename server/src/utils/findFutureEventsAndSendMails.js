import { Event } from "../models/event.model.js";
import { sendEmail } from "./emailService.js";
import mongoose from "mongoose";

//helper function for sending email
const sendCancellationEmail = async (to, eventTitle) => {
    const subject = `URGENT: Event Cancelled - ${eventTitle}`;
    const text = `We are very sorry to inform you that the event ${eventTitle} has been cancelled because the host deleted their account.`;
    const html = `<p>We're sorry to inform you that the event <strong>"${eventTitle}"</strong> you registered for has been <span style="color: red;">cancelled</span>.</p>`

    await sendEmail({ to, subject, text, html })
}

const findFutureEventAndNotifyUsersOfCancelledEvents = async (userIdo) => {
    const userId = new mongoose.Types.ObjectId(userIdo);

    const futureEvents = await Event.aggregate([
    {
      //1. matching future events hosted by user
      $match: {
        hostId: userId,
        date: { $gte: new Date() },
        // Only match events that have registered attendees
        registeredAttendees: { $exists: true, $ne: [] }
      }
    },
    {
      $project: {
        _id: 1,
        title: 1,
        registeredAttendees: 1
      }
    },
    //2. deconstructing the array of objects
    {
      $unwind: "$registeredAttendees"
    },
    {
      //3. lookup user details using the nested userId field
      $lookup: {
        from: "users",
        localField: "registeredAttendees.userId",
        foreignField: "_id",
        as: "attendee"
      }
    },
    {
      $unwind: "$attendee"
    },
    {
      $project: {
        _id: 0,
        eventTitle: "$title",
        attendeeEmail: "$attendee.email"
      }
    }
  ]);

  for (const { attendeeEmail, eventTitle } of futureEvents) {
    try {
      await sendCancellationEmail(attendeeEmail, eventTitle);
    } catch (err) {
      console.error(`Failed to send email to ${attendeeEmail} for event "${eventTitle}"`, err);
    }
  }

}

export { findFutureEventAndNotifyUsersOfCancelledEvents }