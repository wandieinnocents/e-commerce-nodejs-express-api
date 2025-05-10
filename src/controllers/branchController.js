const Branch = require('../models/Branch');

// create branch
const createBranch = async (req, res) => {
    const { branch_code, branch_name, branch_status, branch_address, created_by, updated_by } = req.body;
    if (!branch_name) {
        return res.status(401).json({ message: "Branch name is required" });
    }

    try {
        const existing = await Branch.findOne({ branch_name });
        if (existing) {
            return res.status(401).json({ message: "Branch already exists" });
        }

        // Find the last inserted branch (sorted by creation)
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

        const newBranch = await Branch.create({ branch_code, branch_name, branch_status, branch_address, created_by, updated_by });

        // response
        res.status(201).json({
            success: true,
            message: "Branch created successfully",
            data: newBranch,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again later.",
            error: error.message,
        });
    }
};

// get all branches
const getAllBranches = async (req, res) => {
    try {
        const branches = await Branch.find();
        //if no branches found
        if (!branches || branches.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No branches found",
            });
        }

        res.status(201).json({
            success: true,
            message: "Branches retrieved successfully",
            data: branches,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again later.",
            error: error.message,
        });
    }
};

//get branch by id
const getBranchById = async (req, res) => {
    const { id } = req.params;
    try {
        const branch = await Branch.findById(id);
        if (!branch) {
            return res.status(404).json({ message: "Branch not found" });
        }
        res.status(201).json({
            success: true,
            message: "Branch retrieved successfully",
            data: branch,
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again later.",
            error: error.message,
        });
    }
};

//update branch 
const updateBranch = async (req, res) => {
    const { id } = req.params;
    const { branch_code, branch_name, branch_status, branch_address, created_by, updated_by } = req.body;
    try {
        const branch = await Branch.findByIdAndUpdate(id, { branch_name, branch_status, branch_address, created_by, updated_by }, { new: true });
        if (!branch) return res.status(404).json({ message: "Branch not found" });
        // response
        res.status(201).json({
            success: true,
            message: "Branch created successfully",
            data: branch,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again later.",
            error: error.message,
        });
    }
}

//delete branch
const deleteBranch = async (req, res) => {
    const { id } = req.params;
    try {
        const branch = await Branch.findByIdAndDelete(id);
        if (!branch) {
            return res.status(404).json({ message: "Branch not found" });
        }
        // response
        res.status(200).json({
            success: true,
            message: "Branch deleted successfully",
            data: branch,
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again later.",
            error: error.message,
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

