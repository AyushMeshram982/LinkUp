import mongoose from "mongoose";
import { Event } from "../models/event.model.js";
import { User } from "../models/user.model.js";
import path from 'path';
import { sendEventCancellationNotification } from "../utils/notifyEventCancellation.js";
import { deleteImageFromDisk } from "../utils/deleteExistingImage.js";
import { generateAndSaveQrData } from "../utils/qrGeneratorService.js"

const Events = async (req, res) => {
    const { city, isPaid, date, timeFrom, timeTo, search } = req.query;

    console.log("city: ", city, " isPaid: ", isPaid, ' date: ', date, " timeFrom: ", timeFrom, " timeTo: ", timeTo, " search: ", search );
    // console.log(req.query);

    //Buidling the query object
    let query = {}
    let sort = { date: 1, time: 1 };

    //search filter (handles title, keywords and address)
    if(search){
        const searchRegex = { $regex: search, $options: 'i' } //case-insensitive search

        //using $or to search across multiple fields
        query.$or = [
            {
                title: searchRegex
            },
            {
                address: searchRegex
            },
            {
                keywords: searchRegex
            }
        ]
    }

    //city filter: only show events in that city
    if(city){
        query.city = city;
        console.log(city);
    }

    //status filter: Do not show cancelled events
    query.isCancelled = false;

    //Time filter: only show events with a future date
    query.date = { $gte: new Date()};

    //Additional filters: Based on chip filters
    if(isPaid === 'true'){
        query.isPaid = true
    }
    else if (isPaid === 'false'){
        query.isPaid = false
    }

    //Date filter
    if(date){
        //the date in req.query is in the form of string like: 2025-09-30, but in the database has data type as Date, meaning there it is stored with hours, minutes, seconds, milliseconds, like: 2025-09-30T19:30:00:000Z, so now we are making that string date that we received from req.query into actual javascript Date
        const selectedDate = new Date(date);
        const nextDay = new Date(selectedDate) //making copy of selectedDate
        selectedDate.setHours(0, 0, 0, 0);
        nextDay.setHours(0, 0, 0, 0);

        //Now here in the following line: selectedDate.getDate() returns the day, meaning if date is 2025-09-30T19:30:00:000Z, it gives 30, adding 1 in it makes it 31, then we use setDate to set the day, so if like date is dat = 2025-09-15 so if do: dat.setDate(20), so now dat is = 2025-09-20, But if it is dat = 2025-09-30 then we do dat.setDate(31) so as it knows september only has 30 days in it so it makes it: 2025-10-01, meaning moving it to the next correct date
        nextDay.setDate(selectedDate.getDate() + 1);

        query.date = {$gte: new Date(selectedDate), $lt: new Date(nextDay)}

        console.log('date: ', date, 'selected date: ', selectedDate, 'nextDay: ', nextDay, ' query.date: ' , query.date);
    }

    //Time filter
    
    if(timeFrom || timeTo){

        if(timeFrom && timeTo){
            query.time = { $gte: timeFrom, $lte: timeTo };
        }
        else if(timeFrom){
            query.time = { $gte: timeFrom }
        }
        else if (timeTo){
            query.time = { $lte: timeTo }
        }

    }

    // console.log(query);

    try{
        let pipeline = [];

        //stage 1: filter all dataset based on all query parameters
        pipeline.push({ $match: query });

        //stage 2: calculating the total number of seats taken
        pipeline.push({
            $addFields: {
                // Calculate sum of the 'seats' field from the 'registeredAttendees' array
                seatsTaken: { $sum: "$registeredAttendees.seats" }
            }
        });

        // apply sorting
        pipeline.push({ $sort: sort });

        //executing the pipeline
        const events = await Event.aggregate(pipeline);

        console.log(events);

        //success response
        return res.status(200).json(events);
    }
    catch (error) {
        console.error("Fetch Events Error: ", error);
        res.status(500).json({ error: `Server error while fetching events: ${error.message}` })
    }

}

const singleEvent = async (req, res) => {

    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({ error: 'Invalid Event Id format' });
    }

    try{

        const eventId = new mongoose.Types.ObjectId(id);

        //Building and executing aggreagation pipeline
        const aggregationPipeline = [
            //1. match the single event by id
            { $match: { _id: eventId } },

            //2. calculate total number of seats taken
            {
                $addFields: {
                    seatsTaken: { $sum: "$registeredAttendees.seats" }
                }
            }
        ];

        const aggregatedResult = await Event.aggregate(aggregationPipeline);
        const eventData = aggregatedResult[0];

        if(!eventData){
            res.status(404).json({ error: 'Event not found.' })
        }

        //Phase - 2: Standard population - (populate hosts, likes, comments, attendees)
        const populatedEvent = await Event.populate(eventData, [
            { path: 'hostId', select: 'name profileImageUrl' },
            { path: 'likes', select: 'name profileImageUrl' },
            {
                //nested population for comments
                path: 'comments.userId',
                select: 'name profileImageUrl'
            }
            // NOTE: Attendees populate is removed here as the data is complex and better handled by the frontend 
            // from the raw data, or a separate dedicated API.
        ]);

        //success response
        return res.status(200).json(populatedEvent);
    }
    catch(error){
        console.error("Fetch Single Event Error: ", error);
        
        return res.status(500).json({ error: `Server error while fetching the event details: ${error.message}` })
    }

} 

const createEvent = async (req, res) => {
    
    const hostId = req.user._id;

    //getting data from form (req.body) and file path (req.file)
    const { title, description, city, address, keywords, date, time, isPaid, totalSeats, price, hours } = req.body;

    const imagePath = req.file ? path.join('uploads', 'eventImages', req.file.filename) : null

    //Basic validation
    if(!title || !city || !address || !date || !time || !req.file){
        return res.status(400).json({ error: 'Please provide all required fields, including the event image.' })
    }

    //converting non-string types for mongoose
    const isPaidBool = isPaid === 'true';
    const totalSeatsInt = parseInt(totalSeats);
    const priceFloat = price ? parseFloat(price) : 0;
    const hoursFloat = hours ? parseFloat(hours) : null;

    //price validation
    if(isPaidBool && (priceFloat <= 0 || isNaN(priceFloat))){
        return res.status(400).json({ error: 'paid events must have a valid price greater than zero.' });
    }

    try{
        //preparing keywords array
        const keywordsArray = Array.isArray(keywords) ? keywords : (keywords ? keywords.split(',').map(k => k.trim()) : []);

        const newEvent = await Event.create({
            title, 
            description,
            imageUrl: imagePath, 
            hostId,
            city,
            address,
            keywords: keywordsArray,
            date: new Date(date),
            time,
            isPaid: isPaidBool,
            totalSeats: totalSeatsInt,
            price: priceFloat,
            hours: hoursFloat
        });

        //qr code generation and adding in the new Event
        const eventWithQr = await generateAndSaveQrData(newEvent);

        //updating the Host's profile (Adding the new event id to hostedevents array)
        await User.findByIdAndUpdate(hostId, { $push: { hostedEvents: newEvent._id } })

        //Success Response
        return res.status(201).json(eventWithQr);
    }
    catch(error){
        console.error("Create Event Error: ", error);

        //Handle validation errors from mongoose
        if(error.name === 'ValidationError'){
            return res.status(400).json({ error: error.message })
        }

        return res.status(500).json({ error: 'Server error while creating event.' })
    }

}


const updateEvent = async (req, res) => {
    const { id } = req.params;
    const hostId = req.user._id;
    let updates = req.body;

    //Check for valid objectIds
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({ error: 'Invalid Event ID format.' });
    }

    //prevent attempts to update registration/seat counts via PUT
    delete updates.registeredAttendees;
    delete updates.totalSeats;
    delete updates.hostId;

    //critical validation for required fields during update
    if(!updates.title || !updates.city || !updates.address || !updates.date || !updates.time){
        return res.status(400).json({ error: 'All primary fields are required for update' })
    }

    const isPaidBool = updates.isPaid === 'true';

    //price and paid status validation
    if(updates.price !== undefined){
        const priceFloat = parseFloat(updates.price);
        //if updating to paid and price is missing or zero
        if(isPaidBool && (priceFloat <= 0 || isNaN(priceFloat))){
            return res.status(400).json({ error: 'Paid events must have a price greater than 0' })
        }
        updates.price = priceFloat;
    }
    else if (isPaidBool){
        // If host attempts to set isPaid=true but doesn't send a price, use the existing price for validation
        // (This check relies on finding existingEvent later, but for input safety, we flag it now)
    }

    //hours update
    if(updates.hours !== undefined){
        const hoursFloat = parseFloat(updates.hours);
        updates.hours = isNaN(hoursFloat) ? null : hoursFloat;
    }

    //preparing keywords if they are being updated
    if(updates.keywords && typeof updates.keywords === 'string'){
        updates.keywords = updates.keywords.split(',').map(k => k.trim());
    }
    else if (updates.keywords === ''){
        //allowing removing keywords by setting to an empty array
        updates.keywords = [];
    }
    else if (updates.keywords === undefined){
        delete updates.keywords;
    }

    try{
        //Finding the existing event
        const existingEvent = await Event.findById(id).select('+registeredAttendees hostId');
        
        if(!existingEvent){
            return res.status(404).json({ error: 'Event not found.' });
        }

        //Host Authorization - If this is the original user who created the Event
        if(existingEvent.hostId.toString() !== hostId.toString()){
            return res.status(403).json({ error: 'Forbidden: You are not the host of this event.' })
        }

        //Handle Cancellation
        const isCancelling = updates.isCancelled === 'true';

        if(isCancelling && existingEvent.isCancelled === false){
            //calling the helper function to find emails and send notifications
            await sendEventCancellationNotification(existingEvent._id, existingEvent.title, existingEvent.registeredAttendees)

            console.log(`[Notification] event ${existingEvent.title} cancelled, Notifying ${existingEvent.registeredAttendees.length} users.`)
        }

        //Handling New image
        if(req.file){
            const imagePath = path.join('uploads', 'eventImages', req.file.filename);
            updates.imageUrl = imagePath;

            //Deleting the old image
            if(existingEvent.imageUrl){
                deleteImageFromDisk(existingEvent.imageUrl);
            } 
        }

        //update the Event
        const updatedEvent = await Event.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        )

        //Success Response
        return res.status(200).json(updatedEvent);
    }
    catch(error){
        console.error("Update Event Error: ", error);

        if(error.name === 'ValidationError'){
            return res.status(400).json({ error: error.message });
        }

        return res.status(500).json({ error: `Server error while updating event: ${error.message}` })
    }

}

const deleteEvent = async (req, res) => {

    const { id } = req.params;
    const hostId = req.user._id;

    //Basic Validation
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({ error: 'Invalid Event ID format.' });
    }

    try{
        //Finding the event and check authorization
        const eventToDelete = await Event.findById(id);

        if(!eventToDelete){
            return res.status(404).json({ error: 'Event not found.' });
        }

        //Host Authorization - the host is the same who posted that event
        if(eventToDelete.hostId.toString() !== hostId.toString()){
            return res.status(403).json({ error: 'Forbidden: You are not authorized to delete this event.' })
        }

        //Database cleanup
        //Remove event ID from the host's hostedEvents array
        await User.findByIdAndUpdate(hostId, { $pull: { hostedEvents: id } });

        //Remove event Id from all registered Attendees registeredEvents arrays
       await User.updateMany(
            { $or: [{ registeredEvents: id }, { likedEvents: id }] },
            { $pull: { registeredEvents: id, likedEvents: id } } // Remove ID from both arrays
        );

        //Deleting the image
        if (eventToDelete.imageUrl) {
            const imagePathOnDisk = path.join(path.resolve(), 'server', 'public', eventToDelete.imageUrl);
        
            try {
                fs.unlinkSync(imagePathOnDisk);
                console.log(`[Cleanup] Deleted event image: ${eventToDelete.imageUrl}`);
            } catch (err) {
                // Log the error but don't stop the main deletion
                console.error(`[Cleanup] Failed to delete image ${eventToDelete.imageUrl}:`, err.message);
            }
        }

        //Deleting the event document
        await Event.findByIdAndDelete(id);

        //Success Response
        return res.status(200).json({ message: 'Event successfully deleted and references cleaned.' })
    }
    catch(error){
        console.error("Delete Event Error: ", error);

        return res.status(500).json({ error: `Server error while deleting event: ${error.message}` })
    }

}

const RegisterUserForEvent = async (req, res) => {

    const { id: eventId } = req.params;
    const userId = req.user._id;
    const { seats } = req.body;

    //Basic validation
    if(!mongoose.Types.ObjectId.isValid(eventId)){
        return res.status(404).json({ error: 'Invalid Event ID format.' });
    }

    const seatsToRegister = parseInt(seats);
    if(isNaN(seatsToRegister) || seatsToRegister < 1){
        return res.status(400).json({ error: 'Invalid number of seats specified. Must be at least 1.' });
    }

    try{
        //Finding the event
        const event = await Event.findById(eventId).select('isCancelled totalseats registeredAttendees');

        if(!event){
            return res.status(404).json({ error: 'Event not found.' })
        }

        //checking if the event is not cancelled
        if(event.isCancelled){
            return res.status(400).json({ error: 'Cannot register: This event has been cancelled.' })
        }

        //checking if the user is already registered
        const isAlreadyRegistered = event.registeredAttendees.some(attendee => attendee.userId.equals(userId));

        if(isAlreadyRegistered){
            return res.status(400).json({ message: 'You are already registered for this event.' })
        }

        //checking for seat Availibility
        //a. calculating total seats taken atomically using aggregation
        const aggregationResult = await Event.aggregate([
            { $match: 
                { _id: new mongoose.Types.ObjectId(eventId) } 
            },
            { $unwind: 
                { 
                    path: "$registeredAttendees", 
                    preserveNullAndEmptyArrays: true
                }
            },
            { $group: 
                { 
                    _id: null,
                    totalSeatsTaken: { $sum: "$registeredAttendees.seats" }
                }
            }

        ]);

        //handling when no one is registered yet (sum is 0)
        const currentSeatsTaken = aggregationResult.length > 0 ? aggregationResult[0].totalSeatsTaken : 0;

        const seatsRemaining = event.totalSeats - currentSeatsTaken;

        //b. Final Availability check
        if(seatsToRegister > seatsRemaining){
            return res.status(400).json({ error: `Registration failed: Only ${seatsRemaining} seats remain.`, remainingSeats: seatsRemaining });
        }

        //update database
        const newRegistration = {
            userId: userId,
            seats: seatsToRegister
        };

        
        //Updating database
        //1. Adding the user ID to the Event's registered Attendees array
        await Event.updateOne({ _id: eventId }, { $push: { registeredAttendees: newRegistration } })

        //2. Add the event ID to the User's registeredEvents array
        await User.updateOne({ _id: userId }, { $push: { registeredEvents: eventId } })

        //success response
        return res.status(200).json({ message: `Successfully registered for the event, taking ${seatsToRegister} seats!`, seatsRegistered: seatsToRegister });
    }
    catch(error){
        console.error("Registration Error: ", error);

        return res.status(500).json({ error: `Server error during event registration: ${error.message}` })
    }

}

const likeEvent = async (req, res) => {

    const { id: eventId } = req.params;
    const userId = req.user._id;

    //Basic Validation
    if(!mongoose.Types.ObjectId.isValid(eventId)){
        return res.status(404).json({ error: 'Invalid Event ID format.' })
    }

    try{
        const user = await User.findById(userId).select('likedEvents');
        const event = await Event.findById(eventId).select('likes');

        if(!event){
            return res.status(404).json({ error: 'Event not found.' })
        }

        //Check if the user has already liked the event
        const isLiked = user.likedEvents.includes(eventId);

        let updateOperator;
        let message;

        if(isLiked){
            //Case 1: Unlike (pull the id from both arrays)
            updateOperator = '$pull';
            message = 'Event Unliked.';
        }
        else{
            //Case 2: Like (push the id to both arrays)
            updateOperator = '$push';
            message = 'Event liked.'
        }

        //1. Updating the Events document (likes array)
        await Event.updateOne({ _id: eventId }, { [updateOperator]: { likes: userId } })

        //2. Updating the User document (likedEvents array)
        await User.updateOne({ _id: userId }, { [updateOperator]: { likedEvents: eventId } })

        //Success Response
        return res.status(200).json({ message, liked: !isLiked })
    }
    catch(error){
        console.error("Like Event Error: ", error);

        res.status(500).json({ error: `Server error during like operation: ${error.message}` })
    }

}

const comment = async (req, res) => {

    const { id: eventId } = req.params;
    const userId = req.user._id;
    const { text } = req.body;

    //Basic Validation
    if(!mongoose.Types.ObjectId .isValid(eventId)){
        return res.status(404).json({ error: 'Invalid Event ID format.' })
    }

    if(!text || text.trim() === ''){
        return res.status(400).json({ error: 'Comment text cannot be empty.' })
    }

    //constructing new comment object
    const newComment = {
        userId: userId,
        text: text,
        createdAt: new Date()
    };

    try{
        const updatedEvent = await Event.findByIdAndUpdate(eventId, { $push: { comments: newComment } }, { new: true, runValidators: true });

        if(!updatedEvent){
            return res.status(404).json({ error: 'Event not found.' })
        }

        return res.status(200).json(newComment);
    }
    catch (error){
        console.error("Comment Error: ", error);

        res.status(500).json({ error: `Server error while posting the comment: ${error.message}` })
    }

}

const checkInUser = async (req, res) => {

    const { qrToken } = req.body;
    const userId = req.user._id;

    if(!qrToken){
        return res.status(400).json({ error: 'QR verification token is missing in the request.' })
    }

    try{
        //finding event using the secure token
        const event = await Event.findOne({ qrCheckinToken: qrToken }).select('registeredAttendees qrTokenExpires title');

        //event not found or invalid token
        if(!event){
            return res.status(404).json({ error: 'Verification failed: QR code is invalid or event not found.' });
        }

        //checking for token expiry
        if(event.qrTokenExpires && event.qrTokenExpires < new Date()){
            return res.status(403).json({ error: 'Verification failed: The QR code has expired.' });
        }

        //checking if the user is registered for the event
        const attendeeRecord = event.registeredAttendees.find((attendee) => attendee.userId.toString() === userId.toString());

        if(!attendeeRecord){
            return res.status(403).json({ error: `Access denied: You are not registered attendee for ${event.title}.`, eventTitle: event.title });
        }

        //success response 
        return res.status(200).json({ message: 'Verification Successful! Welcome to the event.', eventTitle: event.title, seatsReserved: attendeeRecord.seats, isVerified: true });
    }
    catch(error){
        console.error("QR Check-in Error: ", error);

        return res.status(500).json({ error: `Server error during check-in: ${error.message}` });
    }

}

export { Events, singleEvent, createEvent, updateEvent, deleteEvent, RegisterUserForEvent, likeEvent, comment, checkInUser }