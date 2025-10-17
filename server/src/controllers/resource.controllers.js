import mongoose from "mongoose"; //needed for aggregation pipeline
import { Resource } from "../models/resource.model.js";
import { User } from "../models/user.model.js";
import { Event } from "../models/event.model.js";
import path from "path"

const resources = async (req, res) => {

    const { city: userSelectedCity, urgency } = req.query;

    let matchQuery = { isStillNeeded: true }

    //B. City filter
    if(userSelectedCity){
        matchQuery.city = userSelectedCity;
    }

    //C. urgency filter
    if(urgency === 'true'){
        const today = new Date();
        const fourDaysFromNow = new Date();
        fourDaysFromNow.setDate(today.getDate() + 4);

        //filter for resources needed between now and 4 days from now
        matchQuery.neededDate = { $gt: today, $lte: fourDaysFromNow };
    }

    try{
        //prioritizing user's city, then resource needed date, and then if the linked event is paid or not
        const resources = await Resource.aggregate([
            //stage 1: sorting based on city and neededDate
            //$match: Filters the data based on certain conditions
            { $match: matchQuery },

            //stage 2: performing LookUp to get the linked Event documents
            //$lookup: joins data from another collection
            { $lookup: {
                from: 'events',
                localField: 'linkedEventId',
                foreignField: '_id',
                as: 'linkedEvent'
            } },

            //stage 3: deconstruct the linkedEvent array (it will only have 0 or 1 element)
            //$unwind: flattens the array into individual documents
            {
                $unwind: { path: '$linkedEvent', preserveNullAndEmptyArrays: true }
            },

            // stage 4: apply the final multi sort hierarchy
            //$sort: sorts the documents by one or more fields
            {
                $sort: { 'city': 1, 'neededDate': 1, 'linkedEvent.isPaid': -1 }
            },

            //stage 5: project the final structure (optional, but good for cleanup)
            //$project: shapes the output by selecting specific fields or renaming them
            {
                $project: {
                    //keeping all resource fields
                    _id: 1,
                    title: 1,
                    description: 1,
                    resourceImageUrl: 1,
                    neededDate: 1,
                    contactNumber: 1,
                    hostId: 1,
                    city: 1,
                    isStillNeeded: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    linkedEventId: 1,

                    //projecting only the necessary fields from the linked event
                    linkedEvent: {
                        _id: '$linkedEvent._id',
                        title: '$linkedEvent.title',
                        isPaid: '$linkedEvent.isPaid',
                    }
                }
            }
        ])

        //Success Response 
        return res.status(200).json(resources);
    }
    catch(error){
        console.error("Fetch Resources Error: ", error);

        return res.status(500).json({ error: `Server error while fetching resources: ${error.message}` })
    }

}

const singleResource = async (req, res) => {

    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({ error: 'Invalid Resource ID format.' })
    }

    try{

        const resource = await Resource.findById(id)
            .populate('hostId', 'name profileImageUrl')
            .populate('linkedEventId', 'title date time isPaid')

        //checking if resource exists
        if(!resource){
            return res.status(404).json({ error: 'Resource not found.' })
        }

        //success response
        return res.status(200).json(resource);
    }
    catch(error){
        console.error("Fetch Single Resource Error: ", error)

        return res.status(500).json({error: `Server side error while fetching the singleResource details: ${error.message}`})
    }

}

const postResource = async (req, res) => {
    
    const hostId = req.user._id;

    const { title, description, linkedEventId, neededDate, contactNumber } = req.body;

    const imagePath = req.file ? path.join('uploads', 'resourceImages', req.file.filename) : null;

    //Basic validation
    if(!title || !description || !linkedEventId || !neededDate || !contactNumber || !req.file){
        return res.status(400).json({ error: 'Please provide all the details.' })
    }

    //Validating and verifying linked event (security and trust)
    if(!mongoose.Types.ObjectId.isValid(linkedEventId)){
        return res.status(400).json({ error: 'Invalid Linked Event ID format.' })
    }

    try{
        //Finding the linked event
        const linkedEvent = await Event.findById(linkedEventId).select('city hostId');

        if(!linkedEvent){
            return res.status(404).json({ error: 'Linked event not found.' });
        }

        //Ensure the current user who is creating this resource post is the same person who posted the event (security)
        if(linkedEvent.hostId.toString() !== hostId.toString()){
            return res.status(403).json({ error: 'Forbidden: You can only post resources for your own events.' })
        }

        //creating the new resource document
        const newResource = await Resource.create({
            title,
            description,
            resourceImageUrl: imagePath,
            hostId,
            city: linkedEvent.city,
            linkedEventId,
            neededDate: new Date(neededDate),
            contactNumber
        })

        //Adding resource id in the user's postedResources array
        await User.findByIdAndUpdate(hostId, { $push: { postedResources: newResource._id } })

        //success response
        return res.status(201).json(newResource);
    }
    catch(error){

        console.error("Post Resource Error: ", error);

        if(error.name === 'ValidationError'){
            return res.status(400).json({ error: error.message })
        }

        return res.status(500).json({ error: `Server error while posting resource request. ${error.message}` })

    }

}

const updateResource = async (req, res) => {

    const { id } = req.params;
    const hostId = req.user._id;
    let updates = req.body;

    //Basic validation
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({ error: 'Invalid Resource ID format.' })
    }

    try{
        //finding existing resource and checking authorization
        const existingResource = await Resource.findById(id);

        if(!existingResource){
            return res.status(404).json({ error: 'Resource request not found.' })
        }

        //host authorization check (security) - making sure the host is the one updating the document
        if(existingResource.hostId.toString() !== hostId.toString()){
            return res.status(403).json({ error: 'Forbidden: You are not authorized to update this request.' })
        }

        //handling new image upload (optional)
        if(req.file){
            const imagePath = path.join('uploads', 'resourceImages', req.file.filename);

            updates.resourceImageUrl = imagePath;

            //Todo: delete the old image
        }

        //preventing hostId and linkedEventId from being changed
        delete updates.hostId;
        delete updates.linkedEventId;
        delete updates.city;

        //if resource is fulfilled 
        const isFulfilling = updates.isStillNeeded === 'false';
        if(isFulfilling){
            console.log(`[Status change] Resource ID ${id} marked as FULFILLED.`)
        }

        //applying the updates
        const updatedResource = await Resource.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true })

        //success response
        return res.status(200).json(updateResource);
    }
    catch(error){
        console.error("Update Resource Error: ", error)

        //Handling mongoose validation errors
        if(error.name === 'ValidationError'){
            return res.status(400).json({ error: error.message })
        }

        return res.status(500).json({ error: `Server error while updating the resource:  ${error.message}` })
    }

}

const deleteResource = async (req, res) => {

    const { id } = req.params;
    const hostId = req.user._id;

    //Basic validation
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({ error: 'Invalid Resource ID format.' })
    }

    try{
        //finding the resource and authorization
        const resourceToDelete = await Resource.findById(id);

        if(!resourceToDelete){
            //considering it as success as it doesn't exist
            return res.status(200).json({ message: 'Resource request already deleted or not found.' })
        }

        //host authorization
        if(resourceToDelete.hostId.toString() !== hostId.toString()){
            return res.status(403).json({ error: 'Forbidden: You are not authorized to delete this resource request.' })
        }

        //Deleting the resource document
        await Resource.findByIdAndDelete(id);

        //Removing resource id from user's postedResources array
        await User.findByIdAndUpdate(hostId, { $pull: { postedResources: id } })

        //Success Response
        return res.status(200).json({ message: 'Resource post successfully deleted and references cleaned.' })
    }
    catch(error){
        console.error("Delete Resource Error: ", error);

        return res.status(500).json({ error: `Server error while deleting resource: ${ error.message }` })
    }

}

export { resources, singleResource, postResource, updateResource, deleteResource }