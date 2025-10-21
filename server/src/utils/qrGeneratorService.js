import { Event } from "../models/event.model.js";
import crypto from "crypto";
import qrcode from 'qrcode';

const CHECKIN_BASE_URL = process.env.CHECKIN_BASE_URL || "http://linkup.com/checkin/";

//generating the token
const generateSecureToken = () => {

    return crypto.randomBytes(16).toString('hex');
}

//calculating token expiry date
const calculateTokenExpiry = (eventDate) => {
    const expiry = new Date(eventDate);
    expiry.setDate(expiry.getDate() + 1);
    expiry.setHours(0, 0, 0, 0);

    //adding a couple of safety hours (2 hours) 
    expiry.setHours(expiry.getHours() + 2);

    return expiry;
}

//generating qr code
const generateAndSaveQrData = async (eventDocument) => {
    
    const qrCheckinToken = generateSecureToken();
    const qrTokenExpires = calculateTokenExpiry(eventDocument.date);

    //the content in qr code
    const qrContent = `${CHECKIN_BASE_URL}${qrCheckinToken}`;

    //generating qr code data url (base64 string of the image)
    const qrCodeUrl = await qrcode.toDataURL(qrContent, { errorCorrectionLevel: 'H', type: 'image/png' });

    //updating the event document in the database
    const updatedEvent = await Event.findByIdAndUpdate(
        eventDocument._id, 
        { 
            qrCheckinToken: qrCheckinToken,
            qrTokenExpires: qrTokenExpires,
            qrCodeUrl: qrCodeUrl
        },
        { new: true }
    );

    return updatedEvent;

}

export { generateAndSaveQrData };