const mongoose = require('mongoose');
const StaffPosition = require('../../models/staffPosition');
const { storeStaffPositionValidation } = require('../../validations/staffPosition/staffPositionValidation');
const { updateStaffPositionValidation } = require('../../validations/staffPosition/staffPositionValidation');
const { createdResponse, successResponse, updatedResponse, serverErrorResponse, unauthorizedResponse, notFoundResponse, badRequestResponse } = require('../../utils/responseHandler');

// create staff position
const createStaffPosition = async (req, res) => {
    try {
        // Validate input
        const validatedData = await storeStaffPositionValidation.validateAsync(req.body);
        const { position_name, status } = validatedData;

        // Check if staff position already exists
        const existing = await StaffPosition.findOne({ position_name });
        if (existing) {
            return unauthorizedResponse(res, {
                message: "Staff position already exists"
            });
        }

        // Generate new branch_code
        const lastStaffPosition = await StaffPosition.findOne().sort({ createdAt: -1 });

        let newId = 1;

        if (lastStaffPosition && lastStaffPosition.position_code) {
            const lastCode = lastStaffPosition.position_code;
            const match = lastCode.match(/STFP-(\d+)/);
            if (match && match[1]) {
                newId = parseInt(match[1]) + 1;
            }
        }

        // Format to 5 digits
        const formattedId = String(newId).padStart(5, '0');
        const position_code = `STFP-${formattedId}`;

        // Get logged-in user
        const logged_in_user = req.user._id;

        //create the StaffPosition
        const newStaffPosition = await StaffPosition.create({
            position_code, position_name, status, created_by: logged_in_user, updated_by: null
        });

        // response
        return createdResponse(res, {
            message: "Staff position created successfully",
            data: newStaffPosition
        });
    } catch (error) {
        return serverErrorResponse(res, {
            error: error.message
        });
    }
};


// get all staffPositions
const getAllStaffPositions = async (req, res) => {
    try {
        // const branches = await StaffPosition.find();
        // const staff_position = await StaffPosition.findById(id);
        const staff_positions = await StaffPosition.find()
            .populate('created_by', 'username email')   // populate created_by user fields
            .populate('updated_by', 'username email');  // populate updated_by user fields

        const staff_positions_count = await StaffPosition.countDocuments();
        //if no branches found
        if (!staff_positions || staff_positions.length === 0) {
            return notFoundResponse(res, {
                message: "No staff positions found",
            });
        }

        return successResponse(res, {
            message: "Staff Positions retrieved successfully",
            records_count: staff_positions_count,
            data: staff_positions
        });

    } catch (error) {
        // Handle validation errors
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

//get staff position by id
const getStaffPositionById = async (req, res) => {
    const { id } = req.params;
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return badRequestResponse(res, {
            message: "Invalid staff position ID format",
        });
    }

    try {
        const staff_position = await StaffPosition.findById(id)
            .populate('created_by', 'username email')   // populate created_by user fields
            .populate('updated_by', 'username email');  // populate updated_by user fields


        if (!staff_position) {
            return notFoundResponse(res, {
                message: "Staff Position not found",
            });
        }

        //success response
        return successResponse(res, {
            message: "Staff Position retrieved successfully",
            data: staff_position
        });

    } catch (error) {
        return serverErrorResponse(res, {
            error: error.message
        });
    }
};

//update staff_position 
const updateStaffPosition = async (req, res) => {
    const { id } = req.params;
    try {
        const validatedData = await updateStaffPositionValidation.validateAsync(req.body);
        const { position_name, status, created_by, updated_by } = validatedData;

        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return badRequestResponse(res, {
                message: "Invalid Staff position ID format",
            });
        }


        // Check for uniqueness of fields
        const existingStaffPosition = await StaffPosition.findOne({
            // Exclude the current staff_position from the search
            _id: { $ne: id },
            $or: [
                { position_name },
            ]
        });

        if (existingStaffPosition) {
            if (existingStaffPosition.position_name === position_name) {
                return unauthorizedResponse(res, {
                    message: "Staff Position with this name  already exists"
                });
            }
        }

        // Get logged-in user
        const logged_in_user = req.user._id;

        // Update the staff_position
        const staff_position = await StaffPosition.findByIdAndUpdate(id, {
            position_name, status, created_by, updated_by: logged_in_user
        }, { new: true });

        if (!staff_position) {
            return notFoundResponse(res, {
                message: "Staff Position not found",
            });
        }

        // response
        return successResponse(res, {
            message: "Staff position updated successfully",
            data: staff_position
        });
    } catch (error) {
        return serverErrorResponse(res, {
            error: error.message
        });
    }
}

//delete staff_position
const deleteStaffPosition = async (req, res) => {
    const { id } = req.params;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return badRequestResponse(res, {
            message: "Invalid Staff position ID format",
        });
    }

    try {
        const staff_position = await StaffPosition.findByIdAndDelete(id);
        if (!staff_position) {
            return notFoundResponse(res, {
                message: "Staff Position not found",
            });
        }
        // response
        return successResponse(res, {
            message: "Staff Position deleted successfully",
            data: staff_position
        });

    } catch (error) {
        return serverErrorResponse(res, {
            error: error.message
        });
    }
};

module.exports = {
    createStaffPosition,
    getAllStaffPositions,
    getStaffPositionById,
    updateStaffPosition,
    deleteStaffPosition,
};

