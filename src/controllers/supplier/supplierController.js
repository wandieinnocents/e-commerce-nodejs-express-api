const mongoose = require("mongoose");
const Supplier = require('../../models/Supplier');
const { supplierSchemaValidation } = require('../../validations/supplier/supplierValidations');
const { createdResponse, successResponse, updatedResponse, serverErrorResponse, unauthorizedResponse, notFoundResponse, badRequestResponse } = require('../../utils/responseHandler');


// create supplier
const createSupplier = async (req, res) => {
    try {
        const validatedData = await supplierSchemaValidation.validateAsync(req.body);
        const { supplier_name, supplier_email, supplier_phone, supplier_city, supplier_address, supplier_country, supplier_organization, supplier_status, supplier_description, supplier_website_url, supplier_image, created_by, updated_by
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
                return unauthorizedResponse(res, {
                    message: "Supplier with this phone number already exists"
                });
            }
            if (existingSupplier.supplier_email === supplier_email) {
                return unauthorizedResponse(res, {
                    message: "Supplier with this email already exists"
                });
            }
        }

        // Find the last inserted supplier (sorted by creation)
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

        // Get logged-in user
        const logged_in_user = req.user._id;
        //console.log("Logged in user ID:", logged_in_user);

        const newSupplier = await Supplier.create(
            {
                supplier_code, supplier_name, supplier_email, supplier_phone, supplier_city, supplier_address, supplier_country, supplier_organization, supplier_status, supplier_description, supplier_website_url, supplier_image,
                created_by: logged_in_user, updated_by: null
            });

        return createdResponse(res, {
            message: "Supplier created successfully",
            data: newSupplier
        });
    } catch (error) {
        return serverErrorResponse(res, {
            error: error.message
        });
    }
};

// get all suppliers
const getAllSuppliers = async (req, res) => {
    try {
        // const suppliers = await Supplier.find();
        const suppliers = await Supplier.find()
            .populate('created_by', 'username email')   // populate created_by user fields
            .populate('updated_by', 'username email');  // populate updated_by user fields
        const suppliers_count = await Supplier.countDocuments();

        //if no suppliers found
        if (!suppliers || suppliers.length === 0) {
            return notFoundResponse(res, {
                message: "No suppliers found",
            });


        }

        // success response
        return successResponse(res, {
            message: "Suppliers retrieved successfully",
            records_count: suppliers_count,
            data: suppliers
        });

    } catch (error) {
        console.log(error);
        return serverErrorResponse(res, {
            error: error.message
        });
    }
};

//get supplier by id
const getSupplierById = async (req, res) => {
    const { id } = req.params;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return badRequestResponse(res, {
            message: "Invalid supplier ID format",
        });
    }

    try {
        const supplier = await Supplier.findById(id)
            .populate('created_by', 'username email')   // populate created_by user fields
            .populate('updated_by', 'username email');  // populate updated_by user fields
        if (!supplier) {
            return notFoundResponse(res, {
                message: "Supplier not found",
            });
        }

        return successResponse(res, {
            message: "Supplier retrieved successfully",
            data: supplier
        });

    } catch (error) {
        return serverErrorResponse(res, {
            error: error.message
        });
    }
};

//update supplier 
const updateSupplier = async (req, res) => {
    const { id } = req.params;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return badRequestResponse(res, {
            message: "Invalid supplier ID format",
        });
    }

    try {
        // Validate request body
        const validatedData = await supplierSchemaValidation.validateAsync(req.body);
        const { supplier_name, supplier_email, supplier_phone, supplier_city, supplier_address, supplier_country, supplier_organization, supplier_status, supplier_description, supplier_website_url, supplier_image, created_by, updated_by
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
                return unauthorizedResponse(res, {
                    message: "Supplier with this phone number already exists"
                });
            }
            if (existingSupplier.supplier_email === supplier_email) {
                return unauthorizedResponse(res, {
                    message: "Supplier with this email already exists"
                });
            }
        }

        const logged_in_user = req.user._id;

        // Proceed to update
        const supplier = await Supplier.findByIdAndUpdate(id,
            {
                supplier_name, supplier_email, supplier_phone, supplier_city, supplier_address, supplier_country, supplier_organization, supplier_status, supplier_description,
                supplier_website_url, supplier_image, created_by: logged_in_user, updated_by: logged_in_user
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!supplier) {
            return notFoundResponse(res, {
                message: "Supplier not found",
            });
        }

        // success response
        return successResponse(res, {
            message: "Supplier updated successfully",
            data: supplier
        });

    } catch (error) {
        // Joi validation or other errors
        return serverErrorResponse(res, {
            error: error.message
        });
    }
};

//delete supplier
const deleteSupplier = async (req, res) => {
    const { id } = req.params;
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return badRequestResponse(res, {
            message: "Invalid supplier ID format",
        });
    }

    try {
        const supplier = await Supplier.findByIdAndDelete(id);
        if (!supplier) {
            return notFoundResponse(res, {
                message: "Supplier not found",
            });
        }
        // response
        return successResponse(res, {
            message: "Supplier deleted successfully",
            data: supplier
        });

    } catch (error) {
        return serverErrorResponse(res, {
            error: error.message
        });
    }
};

module.exports = {
    createSupplier,
    getAllSuppliers,
    getSupplierById,
    updateSupplier,
    deleteSupplier,
};