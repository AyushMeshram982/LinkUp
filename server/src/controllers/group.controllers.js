import mongoose from "mongoose";
import { Group } from "../models/group.model.js";
import { User } from "../models/user.model.js";
import { Message } from "../models/message.model.js";
import path from "path"

const groups = async (req, res) => {

    //getting filters from query and authenticated User's city (for local affinity)
    //Note: User's selected city will be passed in query
    const { city, active, newGroups, size, search } = req.query;

    //Building initial query and sorting criteria
    let baseQuery = {};
    let localAffinityQuery = {};
    let searchQuery = {};
    let sort = { updatedAt: -1, members: -1 }; // -1 means in descending order and 1 means in ascending order

    //A. City filter (filter for groups whose primaryCity matches the selected city)
    if(city){
        //preparing query to show local groups first
        localAffinityQuery = { primaryCity: city };
    }

    //B. search filter (search across group names and keywords)
    if(search){
        const searchRegex = { $regex: search, $options: 'i' };
    

        searchQuery = {
            $or: [
                { name: searchRegex },
                { keywords: searchRegex }
            ]
        }
    }

    //C. Activity filters
    if(newGroups === 'true'){
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        baseQuery.createdAt = { $gte: thirtyDaysAgo };
        sort = { createdAt: -1 }
    }

    //D. size filter (handled later)
    const sizeFilter = size; //small, medium, large

    //E. Active filter logic - going to rely on default sort by updatedAt to prioritize active groups


    
    try{
        //Executing in two phases for Hybrid model
        let finalGroups = [];

        //Phase - 1: Local Affinity (groups whose primary city matches the selected city)
        //combining base query, search query and local city
        const localGroups = await Group.find({ ...baseQuery, ...searchQuery, ...localAffinityQuery }).sort(sort).limit(20);

        finalGroups.push(...localGroups);

        //query to exclude groups already added (from the local phase)
        let excludeIds = finalGroups.map(g => g._id);

        //Phase - 2: Global/other city groups (groups whose primary city does not match the selected city)
        const globalGroups = await Group.find({ ...baseQuery, ...searchQuery, _id: { $nin: excludeIds }, primaryCity: { $ne: city } }).sort(sort).limit(30);

        finalGroups.push(...globalGroups);

        //Applying size filter (if specified, we must filter the final set)
        if(sizeFilter){
            //let's see
        }

        //success response
        return res.status(200).json(finalGroups)

    }
    catch(error){
        console.error("Fetch Groups Error: ", error);
        return res.status(500).json({ error: `Server error while fetching groups: ${error.message}` })
    }

}

const singleGroup = async (req, res) => {

    const { id: groupId } = req.params;

    //validating the id
    if(!mongoose.Types.ObjectId.isValid(groupId)){
        return res.status(404).json({ error: 'Invalid Group ID format.' });
    }

    try{
        const group = await Group.findById(groupId)
            .populate('hostId', 'name profileImageUrl')
            .populate('members', 'name profileImageUrl');

        if(!group){
            return res.status(404).json({ error: 'Group not found.' })
        }

        const messages = await Message.find({ groupId }).sort({ createdAt: 1 })
            .populate('senderId', 'name profileImageUrl')


        let groupDetails = group.toObject();
        groupDetails.messages = messages;

        //Success response
        return res.status(200).json(groupDetails);

    }
    catch (error){
        console.error("Fetch Single Group Error: ", error);

        return res.status(500).json({ error: `Server error while fetching group details: ${error.message}` })
    }

}

const createGroup = async (req, res) => {

    const hostId = req.user._id;

    const { name, description, keywords, isPublic } = req.body;

    //multer attaches file info to req.file 
    const imagePath = req.file ? path.join('uploads', 'groupImages', req.file.filename) : null;

    if(!name || !description || !req.file){
        return res.status(400).json({ error: 'Please provide Group Name, Description and Group Image' });
    }

    try{
        //checking if group name is already taken
        const existingGroup = await Group.findOne({ name });

        if(existingGroup){
            return res.status(400).json({ error: 'A group with this name already exists.' })
        }

        //getting host's city
        const host = await User.findById(hostId).select('city');

        if(!host){
            return res.status(404).json({ error: 'Host user not found.' })
        }

        const keywordsArray = Array.isArray(keywords) ? keywords : (keywords ? keywords.split(',').map(k => k.trim()) : [])

        const newGroup = await Group.create({
            name,
            description,
            groupImageUrl: imagePath,
            hostId,
            primaryCity: host.city,
            keywords: keywordsArray,
            isPublic: isPublic === 'false' ? false : true,
            members: [hostId]
        })

        //updating the group creater's joinedGroups array
        await User.findByIdAndUpdate(hostId, { $push: { joinedGroups: newGroup._id } })

        //success response
        return res.status(201).json(newGroup);
    }
    catch(error){
        console.error("Create Group Error:", error);

        //handling mongodb unique/validation error
        if(error.code === 11000){
            return res.status(400).json({ error: 'Group name must be unique.' })
        }

        if(error.name === 'ValidationError'){
            return res.status(400).json({ error: error.message });
        }

        return res.status(500).json({ error: 'Server error while creating group.' })
    }

}

const updateGroup = async (req, res) => {

    const { id } = req.params;
    const hostId = req.user._id;
    let updates = req.body;

    //Basic validation
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({ error: 'Invalid Group ID format.' })
    }

    try{
        //finding existing group and authorization
        const existingGroup = await Group.findOne({ _id: id }); //here I have done - findOne({ _id: id }) - cause findOne needs an object, but perviously I was doing - findOne(id) - and here id is just an string not an object, Alternatively I could have also used - findById

        if(!existingGroup){
            return res.status(404).json({ error: 'Group not found.' })
        }

        //Host authorization check - checking if the authenticated user is the original host
        if(existingGroup.hostId.toString() !== hostId.toString()){
            return res.status(403).json({ error: 'Forbidden: You are not the host of this group.' })
        }

        //data cleanup and file handling
        if(req.file){
            const imagePath = path.join('uploads', 'groupImages', req.file.filename);
            updates.groupImageUrl = imagePath;

            //Todo: delete the old image
        }

        if(updates.keywords && typeof updates.keywords === 'string'){
            updates.keywords = updates.keywords.split(',').map(k => k.trim());
        }

        //preventing changing hostId or primaryCity manually
        delete updates.hostId;
        delete updates.primaryCity

        const updatedGroup = await Group.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true })

        //Success response
        return res.status(200).json(updatedGroup)

    }
    catch(error){
        console.error("Update Group Error:", error);

        //Handle Mongodb unique/validation errors
        if(error.code === 11000){
            return res.status(400).json({ error: 'Group name must be unique.' })
        }

        if(error.name === 'ValidationError'){
            return res.status(400).json({ error: error.message })
        }

        return res.status(500).json({ error: `Server error while updating group: ${error.message}` })

    }

}

const joinGroup = async (req, res) => {

    const { id: groupId } = req.params;
    const userId = req.user._id;

    //Basic validation
    if(!mongoose.Types.ObjectId.isValid(groupId)){
        return res.status(404).json({ error: 'Invalid Group Id format' })
    }

    try{
        //finding the existing group
        const group = await Group.findById(groupId).select('name members isPublic');

        if(!group){
            return res.status(404).json({ error: 'Group not found.' })
        }

        //checking for duplicate membership
        if(group.members.some(memberId => memberId.equals(userId))){
            return res.status(200).json({ message: 'User is already a member of this group.'})
        }

        //Access check (Future implementation for Private grous)
        if(group.isPublic === false){
            //Todo: define the process to join the private groups
            //For this API, we will assume joining is allowed if public
            return res.status(403).json({ error: 'This is a private group. A join request is required.' })
        }

        //A. adding the user to group's member array
        const updatedGroup = await Group.findByIdAndUpdate(groupId, { $addToSet: { members: userId } }, { new: true }).select('name members')

        //B. adding groupId in user's joined groups
        await User.findByIdAndUpdate(userId, { $addToSet: { joinedGroups: groupId } })

        //success response
        return res.status(200).json({ message: `Successfully joined ${updatedGroup.name}.group: updatedGroup` })
    }
    catch(error){
        console.error("join Group Error:", error);

        return res.status(500).json({ error: `Server error while joining group: ${error.message}` })
    }

}

const leaveGroup = async (req, res) => {

    const { id: groupId } = req.params;
    const userId = req.user._id;

    //1. Basic validation
    if(!mongoose.Types.ObjectId.isValid(groupId)){
        return res.status(404).json({  error: 'Invalid Group ID format.'})
    }

    try{
        //checking if group exists
        const group = await Group.findById(groupId).select('name members')

        if(!group){
            //treating as success as the group does not exist meaning user is no longer a member
            return res.status(200).json({ message: 'Group not found, but action successful.' })
        }

        //Todo: Important: check if user is host and last member and apply logic accordingly

        //executing leave operations
        //A. removing user from groups members array
        const updatedGroup = await Group.findByIdAndUpdate(groupId, { $pull: { members: userId } }, { new: true }).select('name members')

        //B. removing group id from user's joined groups
        await User.findByIdAndUpdate(userId, { $pull: { joinedGroups: groupId } })

        //success response
        return res.status(200).json({ message: `Successfully left the group: ${updatedGroup.name}.`, group: updatedGroup })

    }
    catch(error){
        console.error("Leave group Error: ", error);

        return res.status(500).json({ error: `Server error while leaving group: ${error.message}` });
    }

}

export { groups, singleGroup, createGroup, updateGroup, joinGroup, leaveGroup }