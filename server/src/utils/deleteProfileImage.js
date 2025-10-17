import fs from 'fs'
import path from 'path'

const delteProfileImageFromDisk = (userProfileImageUrl) => {
    if(!userProfileImageUrl){
        return;
    }

    const imagePathOnDisk = path.join(path.resolve(), 'server', 'public', userProfileImageUrl);

    if(fs.existsSync(imagePathOnDisk)){

        try{
            fs.unlinkSync(imagePathOnDisk);

            console.log(`[CleanupService] Deleted profile image successfully`)
        }
        catch(error){
            console.error(`[CleanupService] Failed to delete image, error: `, error.message)
        }
    }
    else{
        console.log('profile image not found on disk')
    }
}

export { delteProfileImageFromDisk }