import mongoose, { Schema, model } from "mongoose"; // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    } /**In JavaScript, you can slugify a 
    string by converting it to a URL-friendly 
    format where any special 
    characters and spaces are replaced with hyphens or underscores. */,
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String /**mongoose.Schema.Types.ObjectId*/ /**Data type in mongoose represented an unique ID generate
        by MongoDB for each document save in a collection. It is used to refer to documents in other collections 
        and for relation between parent-child
        */,
      required: true,
      //ref: "Category"
    },
    brand: {
      type: String,
      /**enum: ["Apple", "Samsung", "Lenovo"]*/ /** Data type defines a set of possibles values for a variable.
        It is also a validator that verify if a given value is an item of the array.  */
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    sold: {
      type: Number,
      default: 0,
      /**select: false, 
        In Mongoose, select: false is used to exclude a 
        field from being returned in a query result1. 
        It is used when you want to exclude a field from 
        being returned in a query result but still want to 
        keep it in the schema2. For example, if you have a 
        password field that you don’t want to be returned in a query result, 
        you can set select: false for that field1 */
    },
    images: [
      {
        public_id: String,
        url: String,
      },
    ],
    color: [{ type: mongoose.Schema.Types.ObjectId, ref: "Color" }],
    tags: String /**A label attached to someone or something for the 
    purpose of identification or to give other information. */,
    ratings: [
      {
        star: Number,
        comment: String,
        postedby: {
          type: mongoose.Schema.Types.ObjectId, //Mongoose requires an ObjectId.  This is a special type that references a document in another
          ref: "User", //This references another model.  In this case, the User model.  The User model will be referenced by the name "User" in this case.
        },
      },
    ],
    totalrating: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true /**
    In Mongoose, you can use the timestamps option to add two properties 
    of type Date to your schema: createdAt and updatedAt. 
    If you set timestamps: true, Mongoose will add these two properties to your schemacreatedAt represents when this 
    document was created and updatedAt represents when it was last updated1. */,
  }
);

//Export the model
export default model("Product", productSchema);
