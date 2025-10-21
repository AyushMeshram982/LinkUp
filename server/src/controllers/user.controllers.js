import { User } from "../models/user.model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import validator from "validator"
import path from "path";
import crypto from "crypto"
import { Event } from "../models/event.model.js"
import { Group } from "../models/group.model.js";
import { Resource } from "../models/resource.model.js";
import { sendEmail } from "../utils/emailService.js"

//for deleteUser
import { findFutureEventAndNotifyUsersOfCancelledEvents } from "../utils/findFutureEventsAndSendMails.js"
import { ownershipTransferAndGroupLeaving } from "../utils/groupOwnershipTransferAndleavingGroups.js";
import { removeLikes } from "../utils/removeLikesFromEvents.js"
import { changeMessageSenderId } from "../utils/changeMessageSenderId.js";
import { removeUserCommentsFromEvents } from "../utils/removeUserCommentsFromEvents.js";
import { deleteImageFromDisk } from "../utils/deleteExistingImage.js"


// this function helps in creating the token
const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '3d' });

}

const register = async (req, res) => {

    const { name, email, password, city } = req.body;

    const profileImagePath = req.file ? path.join('uploads', 'userImages', req.file.filename) : null

    //Basic validation
    if(!name || !email || !password || !city) {
        return res.status(400).json({ error: 'Please provide name, email, password and city' })
    }

    //Advance validation: checking email format and password length
    if(!validator.isEmail(email)){
        return res.status(400).json({ error: 'Email format is invalid' })
    }
    if(password.length < 8){
        return res.status(400).json({ error: 'Password must be atleast 8 characters long' })
    }

    try{
        //checking for existing user
        const existingUser = await User.findOne({ email })

        if(existingUser){
            return res.status(400).json({ message: "User already exists" })
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        //creating a new user
        const newUser = await User.create({
            name: name,
            email: email,
            password: hashedPassword,
            city: city,
            profileImageUrl: profileImagePath
        })

        //genetating JWT Token - createToken is a function that is defined above
        const token = createToken(newUser._id)

        //success Response
        return res.status(201).json({ 
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            city: newUser.city,
            token: token,
            message: "User registered Successfully!"
        })

    }
    catch (error) {
        console.error("Registration Error: ", error)

        return res.status(500).json({ error: `Server error during registration: ${error.message}` })
    }

}

const login = async (req, res) => {

    const { email, password } = req.body;

    //Basic Validation
    if(!email || !password){
        return res.status(400).json({ error: 'Please provide email and password' })
    }

    //Advanced validation: checking email format
    if(!validator.isEmail(email)){
        return res.status(400).json({ error: 'Email format is Invalid' })
    }

    try{
        const user = await User.findOne({ email });

        //if user does not exist
        if(!user){
            return res.status(400).json({ error: 'Invalid Credentials' })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if(isPasswordCorrect){
            let token = createToken(user._id)

            return res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                city: user.city,
                token: token,
                message: "User Logged in Successfully"
            })
        }
        else{
            return res.status(400).json({ error: 'Invalid Credentials' })
        }
    }
    catch (error){
        console.error("Login Error: ", error)

        return res.status(500).json({ error: `Server Error during Log in: ${error.message}`})
    }

}

const userProfile = async (req, res) => {
    
    const userId = req.user._id;

    try{
        const user = await User.findById(userId)
            .populate('hostedEvents')
            .populate('registeredEvents')
            .populate('joinedGroups')
            .populate('postedResources')
            .select('-password')

        if(!user){
            return res.status(404).json({ error: "User profile not found." })
        }

        return res.status(200).json(user)
    }
    catch(error){
        console.error("Profile Fetch Error: ", error);

        return res.status(500).json({ error: `Server error while fetching profile: ${error.message}` })
    }
}

const updateUser = async(req, res) => {

    const userId = req.user._id;
    let updates = req.body;

    //handling new profile image
    if(req.file){
        const imagePath = path.join('uploads', 'userImages', req.file.filename);
        updates.profileImageUrl = imagePath;

        //Todo: Delete the old profile image
    }

    try{
        //cleaning forbidden fields explicitly
        delete updates.email;
        delete updates.password;
        delete updates.oldPassword;
        delete updates.newPassword;
        delete updates._id;

        //finding and updating user document
        //we rely on mongoose validators to ensure name and city arn't empty if provided
        const updatedUser = await User.findByIdAndUpdate(userId, { $set : updates }, { new: true, runValidators: true }).select('-password');

        if(!updatedUser){
            return res.status(404).json({ error: "User not found." })
        }

        //success response
        return res.status(200).json({ message: 'Profile updated successfully.', user: updatedUser })
    }
    catch(error){
        console.error("Update User Error: ", error);

        if(error.name === 'ValidationError'){
            return res.status(400).json({ error: error.message })
        }

        return res.status(500).json({ error: `Server error while updating profile: ${error.message}` })

    }

}

const updatePassword = async(req, res) => {

    const userId = req.user._id;
    const { oldPassword, newPassword } = req.body;

    //Basic validation
    if(!oldPassword || !newPassword){
        return res.status(400).json({ error: 'Please provide both old and new passwords.' })
    }

    if(newPassword < 8){
        return res.status(400).json({ error: 'New password must be atleast 8 characters long.' })
    }

    try{
        const user = await User.findById(userId).select('+password');

        if(!user){
            return res.status(404).json({ error: 'User not found.' })
        }

        //verifying the old password
        const isMatch = await bcrypt.compare(user.password, oldPassword);

        if(!isMatch){
            return res.status(401).json({ error: 'Verification failed: Incorrect old password.' })
        }

        //hashing the new password
        const saltRounds = 10;
        const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

        //update the database
        user.password = newPasswordHash;
        await user.save();

        //success response
        return res.status(200).json({ message: 'Password updated successfully. Please log in again with your new password.' })
    }
    catch(error){
        console.error("Change Password error: ", error);

        return res.status(500).json({ error: `Server error while changing password: ${ error.message }` })
    }

}

//helper function for generating otp - for forgotPassword
const generateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    return otp;
}

//helper function for generating temporary token - for forgotPassword
const generateResetToken = () => {
    return crypto.randomBytes(16).toString('hex');
}

const forgotPassword = async(req, res) => {

    const { emai } = req.body;

    if(!email || !validator.isEmail(email)){
        return res.status(400).json({ error: 'Please provide a valid email address.' })
    }

    try{
        const user = await User.findOne({ email });

        if(!user){
            //Security: Returning success even if user not found to prevent email fishing
            return res.status(200).json({ message: 'If a user with that email exists, a password reset OTP has been sent.' })
        }

        //1. generating otp
        const otp = generateOtp();
        const resetToken = generateResetToken();
        const otpExpiry = new Date(Date.now() + 2 * 60 * 1000); //2 min expiry

        //2. Storing OTP and Token in database
        user.resetPasswordOtp = otp;
        user.resetPasswordOtpExpires = otpExpiry;
        user.resetPasswordToken =resetToken;
        user.resetPasswordTokenExpires = new Date(Date.now() + 5 * 60 * 1000); //Token valid for only 5 min

        await user.save();

        //Todo : Send Email using nodemailer

        //Success Response
        //we send the secure Reset token back to the client to authorize the next step.
        return res.status(200).json({ message: 'OTP sent to email. Use token and OTP for verification.', resetToken: resetToken })
    }
    catch(error){
        console.error("Forget Password Error: ", error);

        return res.status(500). json({ error: `Server error while initiating password reset: ${error.message}` })
    }

}

const verifyOtp = async (req, res) => {

    const { email, otp, resetToken } = req.body;

    //1. Basic validation
    if(!email || !otp || !resetToken){
        return res.status(400).json({ error: 'Missing credentials: Email, OTP, and Reset Token are required.' })
    }

    if(!validator.isEmail(email)){
        return res.status(400).json({ error: 'Invalid email format.' })
    }

    try{
        //Find user and verify all three temporary fields
        const user = await User.findOne({ email, resetPasswordOtp: otp, resetPasswordToken: resetToken, resetPasswordOtpExpires: { $gt: new Date() } }).select('+resetPasswordOtp resetPasswordOtpExpires resetPasswordToken')

        if(!user){
            return res.status(400).json({ error: 'Verification failed. Please check your OTP or initiate a new reset.' })
        }

        //verfication is complete so - clearing the OTP fields immediately so the OTP cannot be used again, but keeping reset Token
        user.resetPasswordOtp = undefined;
        user.resetPasswordOtpExpires = undefined;

        await user.save();

        //success response
        return res.status(200).json({ message: 'OTP verified successfully. YOu may now set your new password.', email: user.email, resetToken: user.resetPasswordToken })
    }
    catch(error){
        console.error("OTP verification Error: ", error);

        return res.status(500).json({ error: `Server error during OTP verification: ${ error.message }` })
    }

}

const resetPassword = async (req, res) => {

    const { email, newPassword, resetToken } = req.body;

    //Basic validation
    if(!email || !newPassword || !resetToken){
        return res.status(400).json({ error: 'Missing credentials: Email, new password and reset token are required.' })
    }

    if(newPassword.length < 8){
        return res.status(400).json({ error: 'New password must be atleast 8 characters long.' })
    }

    try{
        //Finding User by token, email and expiry - also checking if token hasn't expired
        const user = await User.findOne({ email, resetPasswordToken: resetToken, resetPasswordTokenExpires: { $gt: new Date() } }).select('+password +resetPasswordToken resetPasswordTokenExpires')

        if(!user){
            //generic security error for invalid token, incorrect email or expired token
            return res.status(400).json({ error: 'Password reset failed. The token invalid or has expired.' })
        }

        //hashing new password
        const saltRounds = 10;
        const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

        //updating the user document
        user.password = newPasswordHash;

        //Invalidating the reset token immediately after use
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpires = undefined;

        await user.save();

        //success response
        return res.status(200).json({ message: 'Password reset successful. You can now log in with your new password.' })

    }
    catch (error){
        console.error("Reset password error: ", error);

        return res.status(500).json({ error: `Server error during password reset: ${ error.message }` })
    }

}

const deleteUser = async(req, res) => {

    const userId = req.user._id;
    const { password } = req.body;

    //1. password verification
    if(!password){
        return res.status(400).json({ error: 'Current password is required to delete your account.' })
    }

    try{
        //finding user and selecting the password hash
        const user = await User.findById(userId).select('+password');

        if(!user){
            return res.status(404).json({ error: 'User not found' })
        }

        //verify the provided password
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(401).json({ error: 'Verification failed: Incorrect password.' })
        }

        //finding future events and send emails
        await findFutureEventAndNotifyUsersOfCancelledEvents(userId)
        //transfering group ownership
        await ownershipTransferAndGroupLeaving(userId)
        //remove likes from events
        await removeLikes(userId)
        //change group message sender id
        await changeMessageSenderId(userId)
        //remove user comments from events
        await removeUserCommentsFromEvents(userId)

        //deleting all events 
        await Event.deleteMany(
            { hostId: userId }
        );

        //deleting all resources
        await Resource.deleteMany(
            { hostId: userId }
        );

        //deleting the user's profile image
        await deleteImageFromDisk(user.profileImageUrl);

        //deleting the user account
        await User.findByIdAndDelete(userId)

        //success respone
        return res.status(200).json({ message: 'User account and all associated data deleted successfully.' })

    }
    catch(error){
        console.error("Delete User Orchestration Error: ", error);

        return res.status(500).json({ error: `Server error while deleting account: ${error.message}` });
    }

};

const getHostedQRs = async (req, res) => {

    const userId = req.user._id;

    try{
        //finding all events hosted by this user sorted by date and time (latest events first)
        const hostedEvents = await Event.find({ hostId: userId }).select('title date time qrCodeUrl qrTokenExpires totalSeats registeredAttendees').sort({ date: -1, time: 1 })

        //process the data to calculate remaining seats and check expiry
        const qrList = hostedEvents.map(event => {
            //calculate total seats taken and check expiry
            const seatsTaken = event.registeredAttendees.reduce((sum, reg) => sum + reg.seats, 0);

            return {
                eventId: event._id,
                title: event.title,
                date: event.date,
                time: event.time,
                qrCodeUrl: event.qrCodeUrl,
                qrTokenExpires: event.qrTokenExpires,
                isExpired: event.qrTokenExpires < new Date(),
                totalSeats: event.totalSeats,
                seatsTaken: seatsTaken,
                seatsRemaining: event.totalSeats - seatsTaken
            };

        });

        //success response
        return res.status(200).json(qrList);

    }
    catch(error){
        console.error("Fetch Hosted QRs Error:", error);

        return res.status(500).json({ error: `Server error while fetching hosted QR codes: ${error.message}` });
    }

};


export { register, login, userProfile, updateUser, updatePassword, forgotPassword, verifyOtp, resetPassword, deleteUser, getHostedQRs }