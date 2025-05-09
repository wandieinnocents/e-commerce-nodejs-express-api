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
        res.status(201).json({ newBranch });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// get all branches
const getAllBranches = async (req, res) => {
    try {
        const branches = await Branch.find();
        res.status(200).json(branches);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        });
    }
};



module.exports = {
    createBranch,
    getAllBranches,
    //   getProductById,
    //   updateProduct,
    //   deleteProduct,
    //   getByCategory
};

