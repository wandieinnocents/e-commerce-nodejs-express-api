const mongoose = require("mongoose");
const Supplier = require('../../models/Supplier');
const { supplierSchemaValidation } = require('../../validations/supplier/supplierValidations');


// create branch
const createSupplier = async (req, res) => {
    try {
        const validatedData = await supplierSchemaValidation.validateAsync(req.body);
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
            if (existingSupplier.supplier_phone === supplier_phone) {
                return res.status(401).json({ message: "Supplier with this phone number already exists" });
            }
            if (existingSupplier.supplier_email === supplier_email) {
                return res.status(401).json({ message: "Supplier with this email already exists" });
            }
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

// get all suppliers
const getAllSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find();
        //if no suppliers found
        if (!suppliers || suppliers.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No suppliers found",
            });
        }

        res.status(201).json({
            success: true,
            message: "Suppliers retrieved successfully",
            data: suppliers,
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

//get supplier by id
const getSupplierById = async (req, res) => {
    const { id } = req.params;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid supplier ID format" });
    }

    try {
        const supplier = await Supplier.findById(id);
        if (!supplier) {
            return res.status(404).json({ message: "Supplier not found" });
        }
        res.status(201).json({
            success: true,
            message: "Supplier retrieved successfully",
            data: supplier,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again later.",
            error: error.message,
        });
    }
};

//update supplier 
const updateSupplier = async (req, res) => {
    const { id } = req.params;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid supplier ID format" });
    }

    try {
        // Validate request body
        const validatedData = await supplierSchemaValidation.validateAsync(req.body);
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

        // Check for uniqueness of email or phone (excluding the current supplier)
        const existingSupplier = await Supplier.findOne({
            // Exclude the current supplier from the search
            _id: { $ne: id },
            $or: [
                { supplier_phone },
                { supplier_email }
            ]
        });

        if (existingSupplier) {
            if (existingSupplier.supplier_phone === supplier_phone) {
                return res.status(401).json({ message: "Supplier with this phone number already exists" });
            }
            if (existingSupplier.supplier_email === supplier_email) {
                return res.status(401).json({ message: "Supplier with this email already exists" });
            }
        }

        // Proceed to update
        const supplier = await Supplier.findByIdAndUpdate(
            id,
            {
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
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!supplier) {
            return res.status(404).json({ message: "Supplier not found" });
        }

        res.status(200).json({
            success: true,
            message: "Supplier updated successfully",
            data: supplier,
        });

    } catch (error) {
        // Joi validation or other errors
        if (error.isJoi) {
            return res.status(400).json({ message: error.details[0].message });
        }

        res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again later.",
            error: error.message,
        });
    }
};

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

//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: "Something went wrong. Please try again later.",
//             error: error.message,
//         });
//     }
// };

module.exports = {
    createSupplier,
    getAllSuppliers,
    getSupplierById,
    updateSupplier,
    // deleteBranch,
};