import mongoose, { Schema, model } from "mongoose"; // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    numViews: {
      type: Number,
      default: 0,
    },
    isLiked: {
      type: Boolean,
      default: false,
    },
    isDisliked: {
      type: Boolean,
      default: false,
    },
    likes: [
      {
        // Likes is an array of users id
        type: mongoose.Schema.Types.ObjectId, //Mongoose requires an ObjectId.  This is a special type that references a document in another model
        ref: "User", //This references another model.  In this case, the User model.  The User model will be referenced by the name "User" in this case.
      },
    ],
    dislikes: [
      {
        // Likes is an array of users id
        type: mongoose.Schema.Types.ObjectId, //Mongoose requires an ObjectId.  This is a special type that references a document in another model
        ref: "User", //This references another model.  In this case, the User model.  The User model will be referenced by the name "User" in this case.
      },
    ],
    /**image: {
        type: String,
        default: 'https://www.shutterstock.com/shutterstock/photos/1029506242/display_1500/stock-photo-blogging-blog-concepts-ideas-with-white-worktable-1029506242.jpg'
    },*/
    author: {
      type: String,
      default: "Admin",
    },
    images: [],
  },
  {
  toJSON: {
         // This line will allow us to serialize the model to a JSON string.  This is handy for later operations.  
         virtuals: true, //Enables virtual property support.  This is optional.  It just adds extra fields to the JSON output.  It is not necessary. 
    },
    toObject: {
         	// This is the same as the above, except it will serialize to a JSON object.  This is handy for reading.
            virtuals: true  
    },
    timestamps: true, // Add timestamps to the model.  This is optional.  It adds a 'createdAt' and 'updatedAt' date field.
  }
);

//Export the model
export default model("Blog", blogSchema);
