import { Mongoose, Schema, model } from 'mongoose'; // Erase if already required
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import crypto from 'crypto'; /**It's a native module of node js which provides
cryptographic functionality helping secure our node js apps.  */

// Declare the Schema of the Mongo model
var userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'user'
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    cart: {
        type: Array,
        default: [],
    },
    address: {
        type: String
    },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }], /**Data type in mongoose represented an unique ID generate
    by MongoDB for each document save in a collection. It is used to refer to documents in other collections 
    and for relation between parent-child
    */
    refreshToken: {
        type: String
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
}, {
    timestamps: true, /**
    In Mongoose, you can use the timestamps option to add two properties 
    of type Date to your schema: createdAt and updatedAt. 
    If you set timestamps: true, Mongoose will add these two properties to your 
    schema, createdAt represents when this 
    document was created and updatedAt represents when it was last updated. */
});

/**This is a middleware function that is called directly 
before the item is saved to the database (hence the name pre). 
This makes it possible to execute functions directly before the 
object is saved. Many times it is used to transform a value.
In this case, before the object is saved, 
it will hash the password and save that 
hashed password instead of the plain text version.
next() is a callback that you call when you are 
done with your function, it passes control to the next matching route. 
You can pass an error inside that callback, 
if you do this, the first error-handling middleware 
will handle the function and so your item will not be 
saved to the database. */
userSchema.pre("save", async function (next) {
    // If the password is not modified pass to the next middleware function;
    if (!this.isModified('password')) {
        next();
    };

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

/** In MongoDB Schema.methods is an object which allow us 
to define methods instances customized for documents of our models.
These methods instances act on instances of our model. Example: we can define
a method getFullName() which returns an user's full name generate by 
joining his first name and last name
 */
/** Verify if the password enter during the login
matched the hashed password in the database */
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
};

userSchema.methods.createPasswordResetToken = async function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    return resetToken;
};

//Export the model
export default model('User', userSchema);