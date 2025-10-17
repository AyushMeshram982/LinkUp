import mongoose from "mongoose";
import { Event } from "../models/event.model.js";
import { User } from "../models/user.model.js";
import path from 'path';

const Events = async (req, res) => {
    const { city, isPaid, date, timeFrom, timeTo, search } = req.query;

    //Buidling the query object
    let query = {}

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

        //Now here in the following line: selectedDate.getDate() returns the day, meaning if date is 2025-09-30T19:30:00:000Z, it gives 30, adding 1 in it makes it 31, then we use setDate to set the day, so if like date is dat = 2025-09-15 so if do: dat.setDate(20), so now dat is = 2025-09-20, But if it is dat = 2025-09-30 then we do dat.setDate(31) so as it knows september only has 30 days in it so it makes it: 2025-10-01, meaning moving it to the next correct date
        nextDay.setDate(selectedDate.getDate() + 1);

        query.date = { $gte: selectedDate.setHours(0, 0, 0, 0), $lt: nextDay.setHours(0, 0, 0, 0) }
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

    try{
        //Executing the query, sort by date ascending (showing nearest events first)
        const events = await Event.find(query).sort({ date: 1, time: 1 })

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
        const event = await Event.findById(id)
            .populate('hostId', 'name profileImageUrl')
            .populate('registeredAttendees', 'name profileImageUrl')
            .populate('likes', 'name')
            .populate({ path: 'comments.userId', select: 'name profileImageUrl'})

        //checking if the event exists
        if(!event){
            return res.status(404).json({ error: 'Event not found.' })
        }

        //success response
        return res.status(200).json(event);
    }
    catch(error){
        console.error("Fetch Single Event Error: ", error);
        
        return res.status(500).json({ error: `Server error while fetching the event details: ${error.message}` })
    }

} 

const createEvent = async (req, res) => {
    
    const hostId = req.user._id;

    //getting data from form (req.body) and file path (req.file)
    const { title, description, city, address, keywords, date, time, isPaid, totalSeats } = req.body;

    const imagePath = req.file ? path.join('uploads', 'eventImages', req.file.filename) : null

    //Basic validation
    if(!title || !city || !address || !date || !time || !req.file){
        return res.status(400).json({ error: 'Please provide all required fields, including the event image.' })
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
            isPaid: isPaid === 'true',
            totalSeats: parseInt(totalSeats)
        });

        //updating the Host's profile (Adding the new event id to hostedevents array)
        await User.findByIdAndUpdate(hostId, { $push: { hostedEvents: newEvent._id } })

        //Success Response
        return res.status(201).json(newEvent);
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
    const updates = req.body;

    //Check for valid objectIds
    if(!mongoose.Types.ObjectId.isValid(id)){
        return req.status(404).json({ error: 'Invalid Event ID format.' });
    }

    //critical validation for required fields during update
    if(!updates.title || !updates.city || !updates.address || !updates.date || !updates.time){
        return res.status(400).json({ error: 'All primary fields are required for update' })
    }

    //preparing keywords if they are being updated
    if(updates.keywords && typeof updates.keywords === 'string'){
        updates.keywords = updates.keywords.split(',').map(k => k.trim());
    }
    else if (updates.keywords === undefined){
        delete updates.keywords
    }

    try{
        //Finding the existing event
        const existingEvent = await Event.findById(id);
        
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
            //Todo: Send notification using email service

            console.log(`[Notification] event ${existingEvent.title} cancelled, Notifying ${existingEvent.registeredAttendees.length} users.`)
        }

        //Handling New image
        if(req.file){
            const imagePath = path.join('uploads', 'eventImages', req.file.filename);
            updates.imageUrl = imagePath;

            //Todo: To delete the old image
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

        //Deleting the event document
        await Event.findByIdAndDelete(id);

        //Database cleanup
        //Remove event ID from the host's hostedEvents array
        await User.findByIdAndUpdate(hostId, { $pull: { hostedEvents: id } });

        //Remove event Id from all registered Attendees registeredEvents arrays
        await User.updateMany({ registeredEvents: id }, { $pull: { registeredEvents: id } })

        //Todo: Deleting the image

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

    //Basic validation
    if(!mongoose.Types.ObjectId.isValid(eventId)){
        return res.status(404).json({ error: 'Invalid Event ID format.' });
    }

    try{
        //Finding the event
        const event = await Event.findById(eventId);

        if(!event){
            return res.status(404).json({ error: 'Event not found.' })
        }

        //checking if the event is not cancelled
        if(event.isCancelled){
            return res.status(400).json({ error: 'Cannot register: This event has been cancelled.' })
        }

        //checking if the user is already registered
        const isAlreadyRegistered = event.registeredAttendees.includes(userId);

        if(isAlreadyRegistered){
            return res.status(400).json({ message: 'You are already registered for this event.' })
        }

        //Checking for seat Availability
        const seatsTaken = event.registeredAttendees.length;
        if(seatsTaken >= event.totalSeats){
            return res.status(400).json({ error: 'Registeration failed: All seats are taken.' })
        }

        //Updating database
        //1. Adding the user ID to the Event's registered Attendees array
        await Event.updateOne({ _id: eventId }, { $push: { registeredAttendees: userId } })

        //2. Add the event ID to the User's registeredEvents array
        await User.updateOne({ _id: userId }, { $push: { registeredEvents: eventId } })

        //success response
        return res.status(200).json({ message: 'Successfully registered for the event!' })
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

export { Events, singleEvent, createEvent, updateEvent, deleteEvent, RegisterUserForEvent, likeEvent, comment }