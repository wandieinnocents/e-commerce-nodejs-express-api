const mongoose = require('mongoose');
const Unit = require('../../models/Unit');
const { createdResponse, successResponse, updatedResponse, serverErrorResponse, unauthorizedResponse, notFoundResponse, badRequestResponse } = require('../../utils/responseHandler');
const { storeUnitValidation, updateUnitValidation } = require('../../validations/Unit/UnitValidation');


// create unit
const createUnit = async (req, res) => {
    try {
        // Validate input
        const validatedData = await storeUnitValidation.validateAsync(req.body);
        const { name, status } = validatedData;

        // Check if unit already exists
        const existing = await Unit.findOne({ name });
        if (existing) {
            return unauthorizedResponse(res, {
                message: "Unit already exists"
            });
        }

        // Generate new Unit code
        const lastUnit = await Unit.findOne().sort({ createdAt: -1 });
        let newId = 1;

        if (lastUnit && lastUnit.code) {
            const lastCode = lastUnit.code;
            const match = lastCode.match(/UNI-(\d+)/);
            if (match && match[1]) {
                newId = parseInt(match[1]) + 1;
            }
        }

        // Format to 5 digits
        const formattedId = String(newId).padStart(5, '0');
        const code = `UNI-${formattedId}`;

        // Get logged-in user
        const logged_in_user = req.user._id;

        //create the unit
        const newUnit = await Unit.create({
            code, name, status, created_by: logged_in_user, updated_by: null
        });

        // response
        return createdResponse(res, {
            message: "Unit created successfully",
            data: newUnit
        });

    } catch (error) {
        //joi validation errors
        if (error.isJoi) {
            return serverErrorResponse(res, {
                message: error.details[0].message
            });
        }

        // Handle other errors
        return serverErrorResponse(res, {
            error: error.message
        });
    }
};


// get all Units
const getAllUnits = async (req, res) => {
    try {
        const units = await Unit.find()
            .populate('created_by', 'username email')   // populate created_by user fields
            .populate('updated_by', 'username email');  // populate updated_by user fields

        const units_count = await Unit.countDocuments();
        //if no Units found
        if (!units || units.length === 0) {
            return notFoundResponse(res, {
                message: "No units found",
            });
        }

        return successResponse(res, {
            message: "Units retrieved successfully",
            records_count: units_count,
            data: units
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

//get unit by id
const getUnitById = async (req, res) => {
    const { id } = req.params;
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return badRequestResponse(res, {
            message: "Invalid unit ID format",
        });
    }

    try {
        const unit = await Unit.findById(id)
            .populate('created_by', 'username email')   // populate created_by user fields
            .populate('updated_by', 'username email');  // populate updated_by user fields

        if (!unit) {
            return notFoundResponse(res, {
                message: "Unit not found",
            });
        }

        //success response
        return successResponse(res, {
            message: "Unit retrieved successfully",
            data: unit
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

//update unit 
const updateUnit = async (req, res) => {
    const { id } = req.params;
    try {
        const validatedData = await updateUnitValidation.validateAsync(req.body);
        const { name, status, created_by, updated_by } = validatedData;

        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return badRequestResponse(res, {
                message: "Invalid unit ID format",
            });
        }

        // Check for uniqueness of fields
        const existingUnit = await Unit.findOne({
            // Exclude the current unit from the search
            _id: { $ne: id },
            $or: [
                { name },
            ]
        });

        if (existingUnit) {
            if (existingUnit.name === name) {
                return unauthorizedResponse(res, {
                    message: "Unit with this name  already exists"
                });
            }
        }

        // Get logged-in user
        const logged_in_user = req.user._id;

        // Update the unit
        const unit = await Unit.findByIdAndUpdate(id, {
            name, status, created_by: logged_in_user, updated_by: logged_in_user
        }, { new: true });

        if (!unit) {
            return notFoundResponse(res, {
                message: "Unit not found",
            });
        }

        // response
        return successResponse(res, {
            message: "Unit updated successfully",
            data: unit
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

//delete unit
const deleteUnit = async (req, res) => {
    const { id } = req.params;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return badRequestResponse(res, {
            message: "Invalid unit ID format",
        });
    }

    try {
        const unit = await Unit.findByIdAndDelete(id);
        if (!unit) {
            return notFoundResponse(res, {
                message: "Unit not found",
            });
        }
        // response
        return successResponse(res, {
            message: "Unit deleted successfully",
            data: unit
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
    createUnit,
    getAllUnits,
    getUnitById,
    updateUnit,
    deleteUnit,
};

