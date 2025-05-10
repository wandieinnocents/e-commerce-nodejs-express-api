const Supplier = require('../../models/Supplier');
const Joi = require('joi');


// Schema validation
const supplierSchema = Joi.object({
    supplier_name: Joi.string().trim().required().messages({
        'any.required': 'Supplier name is required',
        'string.empty': 'Supplier name cannot be empty',
    }),
    /*
    branch_status: Joi.number().integer().optional().messages({
        'number.base': 'Branch status must be a number',
    }),
    */
    supplier_phone: Joi.number().integer().optional().messages({
        'number.required': 'Phone number is required',
        'number.base': 'Phone number must be a number',
        'number.empty': 'Phone number cannot be empty',
    }),
    branch_address: Joi.string().trim().optional(),
    created_by: Joi.number().integer().optional().messages({
        'number.base': 'Created by must be a number',
    }),
    updated_by: Joi.number().integer().optional().messages({
        'number.base': 'Updated by must be a number',
    }),
}).strict().unknown(false);


// create branch
const createSupplier = async (req, res) => {


    try {

        const validatedData = await supplierSchema.validateAsync(req.body);
        const {
            supplier_name,
            supplier_email,
            supplier_phone,
            supplier_city,
            supplier_address,
            supplier_country,
            supplier_organization,
            supplier_status,
            supplier_description,
            supplier_website_url,
            supplier_image,
            created_by,
            updated_by
        } = validatedData;

        // Check if supplier with the same phone or email already exists
        const existingSupplier = await Supplier.findOne({
            $or: [
                { supplier_phone },
                { supplier_email }
            ]
        });

        if (existingSupplier) {
            return res.status(401).json({ message: "Supplier with this phone or email already exists" });
        }

        // Find the last inserted branch (sorted by creation)
        const lastSupplier = await Supplier.findOne().sort({ createdAt: -1 });

        let newId = 1;

        if (lastSupplier && lastSupplier.supplier_code) {
            const lastCode = lastSupplier.supplier_code;
            const match = lastCode.match(/SUPL-(\d+)/);
            if (match && match[1]) {
                newId = parseInt(match[1]) + 1;
            }
        }

        // Format to 5 digits
        const formattedId = String(newId).padStart(5, '0');
        const supplier_code = `SUPL-${formattedId}`;

        const newSupplier = await Supplier.create(
            {
                supplier_code,
                supplier_name,
                supplier_email,
                supplier_phone,
                supplier_city,
                supplier_address,
                supplier_country,
                supplier_organization,
                supplier_status,
                supplier_description,
                supplier_website_url,
                supplier_image,
                created_by,
                updated_by
            });

        // response
        res.status(201).json({
            success: true,
            message: "Supplier created successfully",
            data: newSupplier,
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
// const getAllBranches = async (req, res) => {
//     try {
//         const branches = await Branch.find();
//         //if no branches found
//         if (!branches || branches.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: "No branches found",
//             });
//         }

//         res.status(201).json({
//             success: true,
//             message: "Branches retrieved successfully",
//             data: branches,
//         });

//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             success: false,
//             message: "Something went wrong. Please try again later.",
//             error: error.message,
//         });
//     }
// };

// //get branch by id
// const getBranchById = async (req, res) => {
//     const { id } = req.params;
//     try {
//         const branch = await Branch.findById(id);
//         if (!branch) {
//             return res.status(404).json({ message: "Branch not found" });
//         }
//         res.status(201).json({
//             success: true,
//             message: "Branch retrieved successfully",
//             data: branch,
//         });

//     } catch (err) {
//         return res.status(500).json({
//             success: false,
//             message: "Something went wrong. Please try again later.",
//             error: error.message,
//         });
//     }
// };

// //update branch 
// const updateBranch = async (req, res) => {
//     const { id } = req.params;
//     const { branch_code, branch_name, branch_status, branch_address, created_by, updated_by } = req.body;
//     try {
//         const branch = await Branch.findByIdAndUpdate(id, { branch_name, branch_status, branch_address, created_by, updated_by }, { new: true });
//         if (!branch) return res.status(404).json({ message: "Branch not found" });
//         // response
//         res.status(201).json({
//             success: true,
//             message: "Branch created successfully",
//             data: branch,
//         });
//     } catch (err) {
//         return res.status(500).json({
//             success: false,
//             message: "Something went wrong. Please try again later.",
//             error: error.message,
//         });
//     }
// }

// //delete branch
// const deleteBranch = async (req, res) => {
//     const { id } = req.params;
//     try {
//         const branch = await Branch.findByIdAndDelete(id);
//         if (!branch) {
//             return res.status(404).json({ message: "Branch not found" });
//         }
//         // response
//         res.status(200).json({
//             success: true,
//             message: "Branch deleted successfully",
//             data: branch,
//         });

//     } catch (err) {
//         return res.status(500).json({
//             success: false,
//             message: "Something went wrong. Please try again later.",
//             error: error.message,
//         });
//     }
// };

module.exports = {
    createSupplier,
    // getAllBranches,
    // getBranchById,
    // updateBranch,
    // deleteBranch,
};

