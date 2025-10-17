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

