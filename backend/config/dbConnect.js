import mongoose from "mongoose"


/**Establish a connection with our  database */
const dbConnect = () => {
    try {
        const con = mongoose.connect(process.env.MONGODB_URL);
        console.log('Database connected successfully');
    } catch (error) {
        // throw new Error(error)
        console.log("Error! Database connection failed.");
    };
};

export default dbConnect;