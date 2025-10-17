import express from "express"

const router = express.Router();

import { register, login, userProfile, updateUser, updatePassword, forgotPassword, verifyOtp, resetPassword, deleteUser } from "../controllers/user.controllers.js"
import { requireAuth } from "../middlewares/requireAuth.js";
import upload from "../middlewares/upload.js";

//when request comes on '/user/register' register function will be called
router.post('/register', upload.single('profileImage'), register)

//when request comes on '/user/login' login function will be called
router.post('/login', login)

//when request comes on '/user/profile/:id' requireAuth middleware is called first, if it passes then userProfile function will be called
router.get('/profile', requireAuth, userProfile)

//to update the user profile
router.put('/profile', requireAuth, upload.single('profileImage'), updateUser)

// to change the password when the user knows the old password
router.post('/change-password', requireAuth, updatePassword)

//when the user has forgotten their password
router.post('/forgot-password', forgotPassword)

//verfying the otp
router.post('/verify-otp', verifyOtp)

//otp is verified and now they can change the password
router.post('/reset-password', resetPassword)

//to delete the user / user account
router.delete('/profile', requireAuth, deleteUser)

export default router