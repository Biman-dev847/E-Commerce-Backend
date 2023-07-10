import Product from "../models/productModel.js";
import asyncHandler from "express-async-handler";
import slugify from "slugify"; /**This module is used to convert 
a string characters in a string characters readable by a machine,
often it is used for URLs and files names */
import User from "./../models/userModel.js";
import { validateMongoDbId } from "../utils/validateMongodbid.js";

export const createProduct = asyncHandler(async (req, res) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const newProduct = await Product.create(req.body);
        res.json({
            message: "Product added successfully",
            data: newProduct
        });
    } catch (error) {
        throw new Error(error);
    }
});

export const updateProduct = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const updatedProduct = await Product.findOneAndUpdate(id,
            req.body, {
            new: true
        });
        res.json({
            msg: "Product updated successfully.",
            data: updatedProduct
        })

    } catch (error) {
        throw new Error(error)
    }
});

export const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deletedProduct = await Product.findOneAndDelete(id);
        res.json({
            msg: "Product deleted successfully.",
            data: deletedProduct
        });
    } catch (error) {
        throw new Error(error)
    }
});


export const getAProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    //console.log(id)
    try {
        const findProduct = await Product.findById(id).populate("color");
        res.json(findProduct);
    } catch (error) {
        throw new Error(error);
    };
});

export const getAllProducts = asyncHandler(async (req, res) => {
    /**console.log(req.query), In Express.js, req.query is an object 
    containing the property for each query string parameter in the route1.
     Query strings are a part of the URL that contains data to be passed to
      web applications2. The req.query object is used to access query 
      string parameters in Express.js.*/;
    try {
        /**1-Filtring product */
        // We can get products by req.query string like this: const getAllProducts = await Product.find(req.query)
        // Or like this below as we only get products by query'string:
        /**  const getAllProducts = await Product.find({
             brand: req.query.brand,
             category: req.query.category
         });*/
        // Or:const getAllProducts = await Product.where("category").equals(req.query.category);

        const queryObj = { ...req.query };/** The req.query is the main query object and the 
        queryObj will be the main query object modified after deleting 
        fields enumerated in the array excludeFields.*/

        // Exclude these following query string parameters if they are in the request query object
        const excludeFields = ["page", "sort", "limit", "fields"];
        excludeFields.forEach(el => delete queryObj[el]); 	//delete is a function in the Express.js library. It's used to delete a key from an object.
        console.log(queryObj, req.query);

        /**Convert queryObj into a json data type and affect it to a new variable */
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`/**$$ is used to insert $ symbol in replace method */); /**  Find globally (/g) a match at the beginning of a
         word like this: \bWORD, or at the end of a word like this: WORD\b, and replace the second argument
          passed to the replace function.*/;
        //console.log(JSON.parse(queryStr));

        let query = Product.find(JSON.parse(queryStr));

        /**2- Sorting product */
        if (req.query.sort) {
            const sortBy = req.query.sort.split(",").join(" ");/** Here we want to pass two values 
            provided in the request or more 
            to the same parameter,  there is no defined standard to do this.
            Now in my backend, I split the value received with 
            a split function which always creates a list and joined by the join() method the elements of 
            the array returned by the split() method  . */

            query = query.sort(sortBy); /**query.sort() will sort products alphabetically order 
            if the query is a string or numerically if it is number; and place (-) 
            before a query will reverse the sort;
            Sets the sort order. If an object is passed, 
            values allowed are asc, desc, ascending, descending, 1, and -1.  */
        } else {
            query = query.sort("-createdAt");
        };

        /**3- Get products by limiting fields */
        if (req.query.fields) {
            const fields = req.query.fields.split(",").join(" ");
            query = query.select(fields); /** query.select() is used to send
             fields selected in a mongoDB request  as response, and place (-) before  a field's 
             will not selected.  */
        } else {
            query = query.select("-__v");  /** __v in mongoDB is the key version. 
            With this query string query.select("-__v") we'll get product this fields. */;
        };

        /**4- Get products by limiting number of products showed per page (Pagination) ;*/
        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit); /**The skip() method specifies the number 
        of documents to skip this will helps us to change pages, 
        and the limit() one specifies the maximum number of
         documents the query will return. */ ;

        if (req.query.page) {
            const productCount = await Product.countDocuments();/**Creates a countDocuments
             query: counts the number of documents */

            if (skip >= productCount) throw new Error('This Page does not exists.')

        };

        //console.log(page, limit, skip);

        const product = await Product.find(query).populate("color");

        // Now let get products by queryObj:
        // const getAllProducts = await Product.find(queryObj);
        res.json(product);
    } catch (error) {
        throw new Error(error);
    };
});

export const addToWishlist = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { prodId } = req.body;
    try {
        const user = await User.findById(_id);

        // Verify if the product has already added to the wishlist of the user found;
        const alreadyAdded = user.wishlist.find((id) => id.toString() === prodId);
        if (alreadyAdded) {
            let user = await User.findByIdAndUpdate(
                _id,
                {
                    $pull: { wishlist: prodId },
                },
                {
                    new: true
                }
            );
            res.json(user);  //returns the updated user object.
        } else {
            let user = await User.findByIdAndUpdate(
                _id,
                {
                    $push: { wishlist: prodId },
                },
                {
                    new: true
                }
            );
            res.json(user);  //returns the updated user object.
        };
    } catch (error) {
        throw new Error(error);
    };
});

export const rating = asyncHandler(async (req, res) => {
    const { _id } = req.user;

    // Get the product rated id and number of stars from the req.body;
    const { star, prodId, comment } = req.body;

    // Find the product by the product'id get in the req.body;
    const product = await Product.findById(prodId);
    console.log(product)
    try {

        // Check if the user has already rated product;
        const alreadyRated = product.ratings.find(
            (userId) => userId.postedby.toString() === _id.toString() 	//check if the user who posted the rating for product is the same as the user who requested the product
        );
        if (alreadyRated) {
            const updateRating = await Product.updateOne(
                {
                    ratings: { $elemMatch: alreadyRated },// The $elemMatch operator matches documents that contain an array field with at least one element that matches all the specified query criteria.
                },
                {
                    $set: { "ratings.$.star": star, "ratings.$.comment": comment } // The $set operator replaces the value of a field with the specified value.
                    // ratings.$ acts as a placeholder to update the first element that matches the query condition.

                },
                {
                    new: true
                }); // updateOne updates the first document that matches query's condition
            //res.json(updateRating);
        } else {
            const rateProduct = await Product.findByIdAndUpdate(
                prodId,
                {
                    $push: {
                        ratings: {
                            star: star,
                            comment: comment,
                            postedby: _id
                        }
                    }
                },
                {
                    new: true,
                }
            );
            //res.json(rateProduct);
        };
        const getAllRatings = await Product.findById(prodId);
        let totalRatings = getAllRatings.ratings.length;
        let ratingsum = getAllRatings.ratings
            .map((item) => item.star)
            .reduce((prev, curr) => prev + curr, 0); // Calculate the sum of all the values of each element in the array.
        let actualRating = Math.round(ratingsum / totalRatings); // Calculate the actual average of the product's ratings.
        let finalproduct = await Product.findByIdAndUpdate(
            prodId,
            {
                totalrating: actualRating
            },
            { new: true }
        );
        res.json(finalproduct);
    } catch (error) {
        throw new Error(error);
    }
});





