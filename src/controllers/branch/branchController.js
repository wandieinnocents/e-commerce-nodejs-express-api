const mongoose = require('mongoose');
const Branch = require('../../models/Branch');
const { storeBranchValidation } = require('../../validations/branch/branchValidations');
const { updateBranchValidation } = require('../../validations/branch/branchValidations');
const { createdResponse, successResponse, updatedResponse, serverErrorResponse, unauthorizedResponse, notFoundResponse, badRequestResponse } = require('../../utils/responseHandler');
// const { authMiddlewareJWT } = require('../../middlewares/auth/authMiddleware');

// create branch
const createBranch = async (req, res) => {



    try {
        // Validate input
        const validatedData = await storeBranchValidation.validateAsync(req.body);
        const { branch_name, branch_status, branch_address } = validatedData;

        // Check if branch already exists
        const existing = await Branch.findOne({ branch_name });
        if (existing) {
            // return res.status(401).json({ message: "Branch already exists" });
            return unauthorizedResponse(res, {
                message: "Branch already exists"
            });
        }

        // Generate new branch_code
        const lastBranch = await Branch.findOne().sort({ createdAt: -1 });

        let newId = 1;

        if (lastBranch && lastBranch.branch_code) {
            const lastCode = lastBranch.branch_code;
            const match = lastCode.match(/BR-(\d+)/);
            if (match && match[1]) {
                newId = parseInt(match[1]) + 1;
            }
        }

        // Format to 5 digits
        const formattedId = String(newId).padStart(5, '0');
        const branch_code = `BR-${formattedId}`;

        // Get logged-in user
        const logged_in_user = req.user._id;

        //create the branch
        const newBranch = await Branch.create({
            branch_code, branch_name, branch_status, branch_address,
            created_by: logged_in_user, updated_by: null
        });

        // response
        return createdResponse(res, {
            message: "Branch created successfully",
            data: newBranch
        });
    } catch (error) {
        return serverErrorResponse(res, {
            error: error.message
        });
    }
};

// get all branches
const getAllBranches = async (req, res) => {
    try {
        // const branches = await Branch.find();
        // const branch = await Branch.findById(id);
        const branches = await Branch.find()
            .populate('created_by', 'username email')   // populate created_by user fields
            .populate('updated_by', 'username email');  // populate updated_by user fields

        const branches_count = await Branch.countDocuments();
        //if no branches found
        if (!branches || branches.length === 0) {
            return notFoundResponse(res, {
                message: "No branches found",
            });
        }

        return successResponse(res, {
            message: "Branches retrieved successfully",
            records_count: branches_count,
            data: branches
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

//get branch by id
const getBranchById = async (req, res) => {
    const { id } = req.params;
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return badRequestResponse(res, {
            message: "Invalid branch ID format",
        });
    }

    try {
        // const branch = await Branch.findById(id);
        const branch = await Branch.findById(id)
            .populate('created_by', 'username email')   // populate created_by user fields
            .populate('updated_by', 'username email');  // populate updated_by user fields


        if (!branch) {
            return notFoundResponse(res, {
                message: "Branch not found",
            });
        }

        //success response
        return successResponse(res, {
            message: "Branch retrieved successfully",
            data: branch
        });

    } catch (error) {
        return serverErrorResponse(res, {
            error: error.message
        });
    }
};

//update branch 
const updateBranch = async (req, res) => {
    const { id } = req.params;
    try {
        const validatedData = await updateBranchValidation.validateAsync(req.body);
        const { branch_name, branch_status, branch_address, created_by, updated_by } = validatedData;

        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return badRequestResponse(res, {
                message: "Invalid branch ID format",
            });
        }


        // Check for uniqueness of fields
        const existingBranch = await Branch.findOne({
            // Exclude the current branch from the search
            _id: { $ne: id },
            $or: [
                { branch_name },
            ]
        });

        if (existingBranch) {
            if (existingBranch.branch_name === branch_name) {
                return unauthorizedResponse(res, {
                    message: "Branch with this name  already exists"
                });
            }
        }

        // Get logged-in user
        const logged_in_user = req.user._id;

        // Update the branch
        const branch = await Branch.findByIdAndUpdate(id, {
            branch_name, branch_status, branch_address,
            created_by: logged_in_user, updated_by: logged_in_user
        }, { new: true });

        if (!branch) {
            return notFoundResponse(res, {
                message: "Branch not found",
            });
        }

        // response
        return successResponse(res, {
            message: "Branch updated successfully",
            data: branch
        });
    } catch (error) {
        return serverErrorResponse(res, {
            error: error.message
        });
    }
}

//delete branch
const deleteBranch = async (req, res) => {
    const { id } = req.params;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return badRequestResponse(res, {
            message: "Invalid branch ID format",
        });
    }

    try {
        const branch = await Branch.findByIdAndDelete(id);
        if (!branch) {
            return notFoundResponse(res, {
                message: "Branch not found",
            });
        }
        // response
        return successResponse(res, {
            message: "Branch deleted successfully",
            data: branch
        });

    } catch (error) {
        return serverErrorResponse(res, {
            error: error.message
        });
    }
};

module.exports = {
    createBranch,
    getAllBranches,
    getBranchById,
    updateBranch,
    deleteBranch,
};

