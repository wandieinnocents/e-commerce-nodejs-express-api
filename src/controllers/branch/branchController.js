const mongoose = require('mongoose');
const Branch = require('../../models/Branch');
const { storeBranchValidation } = require('../../validations/branch/branchValidations');
const { updateBranchValidation } = require('../../validations/branch/branchValidations');
const { createdResponse, successResponse, updatedResponse, serverErrorResponse, unauthorizedResponse, notFoundResponse, badRequestResponse } = require('../../utils/responseHandler');


// create branch
const createBranch = async (req, res) => {

    try {
        // Validate input
        const validatedData = await storeBranchValidation.validateAsync(req.body);
        const { branch_name, branch_status, branch_address, created_by, updated_by } = validatedData;

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

        //create the branch
        const newBranch = await Branch.create({ branch_code, branch_name, branch_status, branch_address, created_by, updated_by });

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
        const branches = await Branch.find();
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
        const branch = await Branch.findById(id);
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

        // Update the branch
        const branch = await Branch.findByIdAndUpdate(id, { branch_name, branch_status, branch_address, created_by, updated_by }, { new: true });

        if (!branch) {
            return notFoundResponse(res, {
                message: "Branch not found",
            });
        }

        // response
        return successResponse(res, {
            message: "Branches retrieved successfully",
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

