import { Group } from "../models/group.model.js";
import mongoose from "mongoose";

async function ownershipTransferAndGroupLeaving(userId){

    const ADMIN_ID = "65e69d77639f75a6c11b06c13"; 

    //ownership transfer
    await Group.updateMany(
        { hostId: userId },
        { $set: { hostId: new mongoose.Types.ObjectId(ADMIN_ID) } }
    );

    //group leaving
    await Group.updateMany(
        { members: userId },
        { $pull: { members: userId } }
    );

}

export { ownershipTransferAndGroupLeaving };