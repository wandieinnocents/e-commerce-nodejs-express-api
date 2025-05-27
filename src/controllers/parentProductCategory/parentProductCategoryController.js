const mongoose = require('mongoose');
const parentProductCategory = require('../../models/parentProductCategory');
const { createdResponse, successResponse, updatedResponse, serverErrorResponse, unauthorizedResponse, notFoundResponse, badRequestResponse } = require('../../utils/responseHandler');
const { storeParentProductCategoryValidation } = require('../../validations/parentProductCategory/parentProductCategoryValidation');
const { updateParentProductCategoryValidation } = require('../../validations/parentProductCategory/parentProductCategoryValidation');

// create parent product category
const createParentProductCategory = async (req, res) => {
    try {
        // Validate input
        const validatedData = await storeParentProductCategoryValidation.validateAsync(req.body);
        const { parent_product_category_name, parent_product_category_status } = validatedData;

        // Check if parent product category already exists
        const existing = await parentProductCategory.findOne({ parent_product_category_name });
        if (existing) {
            return unauthorizedResponse(res, {
                message: "Parent product category already exists"
            });
        }

        // Generate new parent product category code
        const lastParentProductCategory = await parentProductCategory.findOne().sort({ createdAt: -1 });
        let newId = 1;

        if (lastParentProductCategory && lastParentProductCategory.parent_product_category_code) {
            const lastCode = lastParentProductCategory.parent_product_category_code;
            const match = lastCode.match(/PPC-(\d+)/);
            if (match && match[1]) {
                newId = parseInt(match[1]) + 1;
            }
        }

        // Format to 5 digits
        const formattedId = String(newId).padStart(5, '0');
        const parent_product_category_code = `PPC-${formattedId}`;

        // Get logged-in user
        const logged_in_user = req.user._id;

        //create the parent_product_category
        const newBrand = await parentProductCategory.create({
            parent_product_category_code, parent_product_category_name, parent_product_category_status,
            created_by: logged_in_user, updated_by: null
        });

        // response
        return createdResponse(res, {
            message: "Parent product category created successfully",
            data: newBrand
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


// get all parent_product_categories
const getAllParentProductCategories = async (req, res) => {
    try {
        const parent_product_categories = await parentProductCategory.find()
            .populate('created_by', 'username email')   // populate created_by user fields
            .populate('updated_by', 'username email');  // populate updated_by user fields

        const parent_product_categories_count = await parentProductCategory.countDocuments();
        //if no parent_product_categories found
        if (!parent_product_categories || parent_product_categories.length === 0) {
            return notFoundResponse(res, {
                message: "No parent product categories found",
            });
        }

        return successResponse(res, {
            message: "Parent product categories retrieved successfully",
            records_count: parent_product_categories_count,
            data: parent_product_categories
        });

    } catch (error) {
        // Handle validation errors
        if (error.isJoi) {
            return badRequestResponse(res, {
                message: error.details[0].message
            });
        }

        // Handle other errors
        return serverErrorResponse(res, {
            error: error.message
        });
    }
};

//get parent_product_category by id
const getParentProductCategoryById = async (req, res) => {
    const { id } = req.params;
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return badRequestResponse(res, {
            message: "Invalid parent product category ID format",
        });
    }

    try {
        const parent_product_category = await parentProductCategory.findById(id)
            .populate('created_by', 'username email')   // populate created_by user fields
            .populate('updated_by', 'username email');  // populate updated_by user fields

        if (!parent_product_category) {
            return notFoundResponse(res, {
                message: "Parent product category not found",
            });
        }

        //success response
        return successResponse(res, {
            message: "Parent product category retrieved successfully",
            data: parent_product_category
        });

    } catch (error) {
        //joi validation errors
        if (error.isJoi) {
            return badRequestResponse(res, {
                message: error.details[0].message
            });
        }
        // Handle other errors
        return serverErrorResponse(res, {
            error: error.message
        });
    }
};

//update parent_product_category 
const updateParentProductCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const validatedData = await updateParentProductCategoryValidation.validateAsync(req.body);
        const { parent_product_category_name, parent_product_category_status, created_by, updated_by } = validatedData;

        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return badRequestResponse(res, {
                message: "Invalid parent_product_category ID format",
            });
        }

        // Check for uniqueness of fields
        const existing = await parentProductCategory.findOne({
            // Exclude the current parent_product_category from the search
            _id: { $ne: id },
            $or: [
                { parent_product_category_name },
            ]
        });

        if (existing) {
            if (existing.parent_product_category_name === parent_product_category_name) {
                return unauthorizedResponse(res, {
                    message: "Parent product category with this name  already exists"
                });
            }
        }

        // Get logged-in user
        const logged_in_user = req.user._id;

        // Update the parent_product_category
        const parent_product_category = await parentProductCategory.findByIdAndUpdate(id, {
            parent_product_category_name, parent_product_category_status,
            created_by, updated_by: logged_in_user
        }, { new: true });

        if (!parent_product_category) {
            return notFoundResponse(res, {
                message: "Parent product category not found",
            });
        }

        // response
        return successResponse(res, {
            message: "Parent product category updated successfully",
            data: parent_product_category
        });
    } catch (error) {

        // joi validation errors
        if (error.isJoi) {
            return badRequestResponse(res, {
                message: error.details[0].message
            });
        }
        return serverErrorResponse(res, {
            error: error.message
        });
    }
}

//delete parent_product_category
const deleteParentProductCategory = async (req, res) => {
    const { id } = req.params;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return badRequestResponse(res, {
            message: "Invalid Parent product category ID format",
        });
    }

    try {
        const parent_product_category = await parentProductCategory.findByIdAndDelete(id);
        if (!parent_product_category) {
            return notFoundResponse(res, {
                message: "Parent product category not found",
            });
        }
        // response
        return successResponse(res, {
            message: "Parent product category deleted successfully",
            data: parent_product_category
        });

    } catch (error) {
        // joi validation errors 
        if (error.isJoi) {
            return badRequestResponse(res, {
                message: error.details[0].message
            });
        }

        //handle other errors
        return serverErrorResponse(res, {
            error: error.message
        });
    }
};

module.exports = {
    createParentProductCategory,
    getAllParentProductCategories,
    getParentProductCategoryById,
    updateParentProductCategory,
    deleteParentProductCategory,
};

