const mongoose = require('mongoose');
const Brand = require('../../models/Brand');
const { createdResponse, successResponse, updatedResponse, serverErrorResponse, unauthorizedResponse, notFoundResponse, badRequestResponse } = require('../../utils/responseHandler');
const { storeBrandValidation } = require('../../validations/brand/brandValidations');
const { updateBrandValidation } = require('../../validations/brand/brandValidations');
// create brand
const createBrand = async (req, res) => {
    try {
        // Validate input
        const validatedData = await storeBrandValidation.validateAsync(req.body);
        const { brand_name, brand_register_date, brand_status, brand_description, brand_image } = validatedData;

        // Check if brand already exists
        const existing = await Brand.findOne({ brand_name });
        if (existing) {
            return unauthorizedResponse(res, {
                message: "Brand already exists"
            });
        }


        // Generate new brandcode
        const lastBrand = await Brand.findOne().sort({ createdAt: -1 });
        let newId = 1;

        if (lastBrand && lastBrand.brand_code) {
            const lastCode = lastBrand.brand_code;
            const match = lastCode.match(/BRD-(\d+)/);
            if (match && match[1]) {
                newId = parseInt(match[1]) + 1;
            }
        }

        // Format to 5 digits
        const formattedId = String(newId).padStart(5, '0');
        const brand_code = `BRD-${formattedId}`;

        // Get logged-in user
        const logged_in_user = req.user._id;

        //create the brand
        const newBrand = await Brand.create({
            brand_code, brand_name, brand_register_date, brand_status, brand_description, brand_image,
            created_by: logged_in_user, updated_by: null
        });

        // response
        return createdResponse(res, {
            message: "Brand created successfully",
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


// get all brands
const getAllBrands = async (req, res) => {
    try {
        const brands = await Brand.find()
            .populate('created_by', 'username email')   // populate created_by user fields
            .populate('updated_by', 'username email');  // populate updated_by user fields

        const brands_count = await Brand.countDocuments();
        //if no brands found
        if (!brands || brands.length === 0) {
            return notFoundResponse(res, {
                message: "No brands found",
            });
        }

        return successResponse(res, {
            message: "Brands retrieved successfully",
            records_count: brands_count,
            data: brands
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

//get brand by id
const getBrandById = async (req, res) => {
    const { id } = req.params;
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return badRequestResponse(res, {
            message: "Invalid brand ID format",
        });
    }

    try {
        // const brand = await Brand.findById(id);
        const brand = await Brand.findById(id)
            .populate('created_by', 'username email')   // populate created_by user fields
            .populate('updated_by', 'username email');  // populate updated_by user fields


        if (!brand) {
            return notFoundResponse(res, {
                message: "Brand not found",
            });
        }

        //success response
        return successResponse(res, {
            message: "Brand retrieved successfully",
            data: brand
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

//update brand 
const updateBrand = async (req, res) => {
    const { id } = req.params;
    try {
        const validatedData = await updateBrandValidation.validateAsync(req.body);
        const { brand_name, brand_register_date, brand_status, brand_description, brand_image, created_by, updated_by } = validatedData;

        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return badRequestResponse(res, {
                message: "Invalid brand ID format",
            });
        }


        // Check for uniqueness of fields
        const existingBrand = await Brand.findOne({
            // Exclude the current brand from the search
            _id: { $ne: id },
            $or: [
                { brand_name },
            ]
        });

        if (existingBrand) {
            if (existingBrand.brand_name === brand_name) {
                return unauthorizedResponse(res, {
                    message: "Brand with this name  already exists"
                });
            }
        }

        // Get logged-in user
        const logged_in_user = req.user._id;

        // Update the brand
        const brand = await Brand.findByIdAndUpdate(id, {
            brand_name, brand_register_date, brand_status, brand_description, brand_image,
            created_by, updated_by: logged_in_user
        }, { new: true });

        if (!brand) {
            return notFoundResponse(res, {
                message: "Brand not found",
            });
        }

        // response
        return successResponse(res, {
            message: "Brand updated successfully",
            data: brand
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

//delete brand
const deleteBrand = async (req, res) => {
    const { id } = req.params;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return badRequestResponse(res, {
            message: "Invalid brand ID format",
        });
    }

    try {
        const brand = await Brand.findByIdAndDelete(id);
        if (!brand) {
            return notFoundResponse(res, {
                message: "Brand not found",
            });
        }
        // response
        return successResponse(res, {
            message: "Brand deleted successfully",
            data: brand
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
    createBrand,
    getAllBrands,
    getBrandById,
    updateBrand,
    deleteBrand,
};

