import mongoose, { Schema, model } from "mongoose"; // Erase if already required

// Declare the Schema of the Mongo model
var cartSchema = new Schema(
  {
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    color: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Color"
    }
  },
  {
    timestamps: true,
  }
);

//Export the model
export default model("Cart", cartSchema);
