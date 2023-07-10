import mongoose from "mongoose";

// Checks if a value (is this case the id) is valid 
export const validateMongoDbId = (id) => {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new Error("This id is not valid or not found");
};