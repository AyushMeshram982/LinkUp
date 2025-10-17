import multer from "multer"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

//file storage location and filename generation
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let dest = path.join(__dirname, '..', '..', 'public', 'uploads', 'eventImages');

        cb(null, dest);
    },

    filename: (req, file, cb) => {
        //using file originalname + Date.now() for uniqueness of name
        const timestamp = Date.now();
        const originalName = file.originalname.replace(/\s/g,'_');

        //Format: originalname-timestamp.ext
        const newFilename = originalName.substring(0, originalName.lastIndexOf('.')) + '-' + timestamp + path.extname(originalName);

        cb(null, newFilename)
    }
})

//creating multer instance
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if(file.mimetype.startsWith('image/')){
            cb(null, true)
        }
        else{
            cb(new Error('Only image files are allowed!'), false);
        }
    }
})

export default upload;