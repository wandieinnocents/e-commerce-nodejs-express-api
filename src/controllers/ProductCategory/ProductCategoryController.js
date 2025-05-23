const mongoose = require('mongoose');
const ProductCategory = require('../../models/ProductCategory');
const { createdResponse, successResponse, updatedResponse, serverErrorResponse, unauthorizedResponse, notFoundResponse, badRequestResponse } = require('../../utils/responseHandler');
const { storeProductCategoryValidation } = require('../../validations/ProductCategory/ProductCategoryValidation');
const { updateProductCategoryValidation } = require('../../validations/ProductCategory/ProductCategoryValidation');
const ParentProductCategory = require('../../models/parentProductCategory');

// create product category
const createProductCategory = async (req, res) => {
    try {
        // Validate input
        const validatedData = await storeProductCategoryValidation.validateAsync(req.body);
        const { parent_product_category_id, product_category_name, product_category_status } = validatedData;

        // check for valid parent product category id
        if (!mongoose.Types.ObjectId.isValid(parent_product_category_id)) {
            return badRequestResponse(res, {
                message: "Invalid parent product category ID"
            });
        }

        // Check if the parent category  exists
        const parentProductCategoryExists = await ParentProductCategory.findById(parent_product_category_id);
        console.log("parentProductCategoryExists", parentProductCategoryExists);
        if (!parentProductCategoryExists) {
            return badRequestResponse(res, {
                message: "Parent product category does not exist"
            });
        }

        // Check if product category already exists
        const existing = await ProductCategory.findOne({ product_category_name });
        if (existing) {
            return unauthorizedResponse(res, {
                message: "Product category already exists"
            });
        }

        // Generate new product category code
        const lastProductCategory = await ProductCategory.findOne().sort({ createdAt: -1 });
        let newId = 1;

        if (lastProductCategory && lastProductCategory.product_category_code) {
            const lastCode = lastProductCategory.product_category_code;
            const match = lastCode.match(/PCAT-(\d+)/);
            if (match && match[1]) {
                newId = parseInt(match[1]) + 1;
            }
        }

        // Format to 5 digits
        const formattedId = String(newId).padStart(5, '0');
        const product_category_code = `PCAT-${formattedId}`;

        // Get logged-in user
        const logged_in_user = req.user._id;

        //create the parent_product_category
        const newProductCategory = await ProductCategory.create({
            product_category_code, parent_product_category_id, product_category_name, product_category_status,
            created_by: logged_in_user, updated_by: null
        });

        // response
        return createdResponse(res, {
            message: "Product category created successfully",
            data: newProductCategory
        });
    } catch (error) {
        //joi validation errors
        if (error.isJoi) {
            return badRequestResponse(res, {
                message: error.details[0].message
            });
        }

        return serverErrorResponse(res, {
            error: error.message
        });
    }
};


// // get all parent_product_categories
// const getAllParentProductCategories = async (req, res) => {
//     try {
//         const parent_product_categories = await ProductCategory.find()
//             .populate('created_by', 'username email')   // populate created_by user fields
//             .populate('updated_by', 'username email');  // populate updated_by user fields

//         const parent_product_categories_count = await ProductCategory.countDocuments();
//         //if no parent_product_categories found
//         if (!parent_product_categories || parent_product_categories.length === 0) {
//             return notFoundResponse(res, {
//                 message: "No parent product categories found",
//             });
//         }

//         return successResponse(res, {
//             message: "Parent product categories retrieved successfully",
//             records_count: parent_product_categories_count,
//             data: parent_product_categories
//         });

//     } catch (error) {
//         // Handle validation errors
//         if (error.isJoi) {
//             return badRequestResponse(res, {
//                 message: error.details[0].message
//             });
//         }

//         // Handle other errors
//         return serverErrorResponse(res, {
//             error: error.message
//         });
//     }
// };

// //get parent_product_category by id
// const getProductCategoryById = async (req, res) => {
//     const { id } = req.params;
//     // Validate ID format
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//         return badRequestResponse(res, {
//             message: "Invalid product category ID format",
//         });
//     }

//     try {
//         const parent_product_category = await ProductCategory.findById(id)
//             .populate('created_by', 'username email')   // populate created_by user fields
//             .populate('updated_by', 'username email');  // populate updated_by user fields

//         if (!parent_product_category) {
//             return notFoundResponse(res, {
//                 message: "product category not found",
//             });
//         }

//         //success response
//         return successResponse(res, {
//             message: "product category retrieved successfully",
//             data: parent_product_category
//         });

//     } catch (error) {
//         //joi validation errors
//         if (error.isJoi) {
//             return badRequestResponse(res, {
//                 message: error.details[0].message
//             });
//         }
//         // Handle other errors
//         return serverErrorResponse(res, {
//             error: error.message
//         });
//     }
// };

// //update parent_product_category 
// const updateProductCategory = async (req, res) => {
//     const { id } = req.params;
//     try {
//         const validatedData = await updateProductCategoryValidation.validateAsync(req.body);
//         const { parent_product_category_name, parent_product_category_status, created_by, updated_by } = validatedData;

//         // Validate ID format
//         if (!mongoose.Types.ObjectId.isValid(id)) {
//             return badRequestResponse(res, {
//                 message: "Invalid parent_product_category ID format",
//             });
//         }

//         // Check for uniqueness of fields
//         const existing = await ProductCategory.findOne({
//             // Exclude the current parent_product_category from the search
//             _id: { $ne: id },
//             $or: [
//                 { parent_product_category_name },
//             ]
//         });

//         if (existing) {
//             if (existing.parent_product_category_name === parent_product_category_name) {
//                 return unauthorizedResponse(res, {
//                     message: "product category with this name  already exists"
//                 });
//             }
//         }

//         // Get logged-in user
//         const logged_in_user = req.user._id;

//         // Update the parent_product_category
//         const parent_product_category = await ProductCategory.findByIdAndUpdate(id, {
//             parent_product_category_name, parent_product_category_status,
//             created_by: logged_in_user, updated_by: logged_in_user
//         }, { new: true });

//         if (!parent_product_category) {
//             return notFoundResponse(res, {
//                 message: "product category not found",
//             });
//         }

//         // response
//         return successResponse(res, {
//             message: "product category updated successfully",
//             data: parent_product_category
//         });
//     } catch (error) {

//         // joi validation errors
//         if (error.isJoi) {
//             return badRequestResponse(res, {
//                 message: error.details[0].message
//             });
//         }
//         return serverErrorResponse(res, {
//             error: error.message
//         });
//     }
// }

// //delete parent_product_category
// const deleteProductCategory = async (req, res) => {
//     const { id } = req.params;

//     // Validate ID format
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//         return badRequestResponse(res, {
//             message: "Invalid product category ID format",
//         });
//     }

//     try {
//         const parent_product_category = await ProductCategory.findByIdAndDelete(id);
//         if (!parent_product_category) {
//             return notFoundResponse(res, {
//                 message: "product category not found",
//             });
//         }
//         // response
//         return successResponse(res, {
//             message: "product category deleted successfully",
//             data: parent_product_category
//         });

//     } catch (error) {
//         // joi validation errors 
//         if (error.isJoi) {
//             return badRequestResponse(res, {
//                 message: error.details[0].message
//             });
//         }

//         //handle other errors
//         return serverErrorResponse(res, {
//             error: error.message
//         });
//     }
// };

module.exports = {
    createProductCategory,
    // getAllParentProductCategories,
    // getProductCategoryById,
    // updateProductCategory,
    // deleteProductCategory,
};

