import express from "express"
import mongoose from "mongoose"
import indexRoutes from "./src/routes/index.js"
import 'dotenv/config'
import cors from "cors"

const app = express();
const port = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/linkup"

app.use(express.json()) //Essential: Allows Express to parse JSON data from req.body (for register, login, etc)
app.use(express.urlencoded({ extended: true }))
app.use(cors())

// to render the images in frontend------------------------------------------------------------------- 
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 👇 Add this line (serves images from public/uploads)
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
// ---------------------------------------------------------------------------------------------------- 

app.use("/", indexRoutes);

const startServer = async () => {
    try{
        await mongoose.connect(MONGO_URI);

        app.listen(port, () => {
            console.log(`express server has started on port: ${port}`)
        })
    }
    catch (error){
        console.error('Failed to connect to MongoDB or start server: ', error.message);
        process.exit(1); //Exit process with failure code
    }
}

startServer();

