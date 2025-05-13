const mongoose = require("mongoose");
const Client = require('../../models/Client');
const { clientSchemaValidation } = require('../../validations/client/clientValidations');


// create branch
const createClient = async (req, res) => {
    try {
        const validatedData = await clientSchemaValidation.validateAsync(req.body);
        const {
            first_name, last_name, other_names, age, email, profession, phone, country_id, address, website, client_status, organization, client_photo, description, created_by, updated_by
        } = validatedData;

        // Check if client with the same phone or email already exists
        const existingClient = await Client.findOne({
            $or: [
                { phone },
                { email }
            ]
        });

        if (existingClient) {
            if (existingClient.phone === phone) {
                return res.status(401).json({
                    success: false,
                    status_code: 401,
                    timestamp: new Date().toISOString(),
                    message: "Client with this phone number already exists"
                });
            }
            if (existingClient.email === email) {
                return res.status(401).json({
                    success: false,
                    status_code: 401,
                    timestamp: new Date().toISOString(),
                    message: "Client with this email already exists"
                });
            }
        }

        // Find the last inserted client (sorted by creation)
        const lastClient = await Client.findOne().sort({ createdAt: -1 });

        let newId = 1;

        if (lastClient && lastClient.client_code) {
            const lastCode = lastClient.client_code;
            const match = lastCode.match(/CLI-(\d+)/);
            if (match && match[1]) {
                newId = parseInt(match[1]) + 1;
            }
        }

        // Format to 5 digits
        const formattedId = String(newId).padStart(5, '0');
        const client_code = `CLI-${formattedId}`;

        const newClient = await Client.create(
            {
                client_code, first_name, last_name, other_names, age, email, profession, phone, country_id, address, website, client_status, organization, client_photo, description, created_by, updated_by
            });

        // response
        res.status(201).json({
            success: true,
            status_code: 201,
            message: "Client created successfully",
            timestamp: new Date().toISOString(),
            data: newClient,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            status_code: 500,
            timestamp: new Date().toISOString(),
            message: "Something went wrong. Please try again later.",
            error: error.message,

        });
    }
};

// get all suppliers
const getAllClients = async (req, res) => {
    try {
        const clients = await Client.find();
        const client_count = await Client.countDocuments();

        //if no clients found
        if (!clients || clients.length === 0) {
            return res.status(404).json({
                success: false,
                status_code: 404,
                timestamp: new Date().toISOString(),
                message: "No clients found",
            });
        }

        res.status(201).json({
            success: true,
            status_code: 201,
            message: "Clients retrieved successfully",
            total_clients: client_count,
            timestamp: new Date().toISOString(),
            data: clients,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            status_code: 500,
            message: "Something went wrong. Please try again later.",
            timestamp: new Date().toISOString(),
            error: error.message
        });
    }
};

//get supplier by id
const getClientById = async (req, res) => {
    const { id } = req.params;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid client ID format" });
    }

    try {
        const client = await Client.findById(id);
        if (!client) {
            return res.status(404).json({
                success: false,
                status_code: 404,
                timestamp: new Date().toISOString(),
                message: "No client found",
            });
        }
        res.status(201).json({
            success: true,
            status_code: 201,
            message: "Client retrieved successfully",
            timestamp: new Date().toISOString(),
            data: client,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            status_code: 500,
            message: "Something went wrong. Please try again later.",
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
};

//update supplier 
const updateClient = async (req, res) => {
    const { id } = req.params;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid supplier ID format" });
    }

    try {
        // Validate request body
        const validatedData = await clientSchemaValidation.validateAsync(req.body);
        const {
            first_name, last_name, other_names, age, email, profession, phone, country_id, address, website, client_status, organization, client_photo, description, created_by, updated_by
        } = validatedData;

        // Check for uniqueness of email or phone (excluding the current client)
        const existingClient = await Client.findOne({
            // Exclude the current client from the search
            _id: { $ne: id },
            $or: [
                { phone },
                { email }
            ]
        });

        if (existingClient) {
            if (existingClient.phone === phone) {
                return res.status(401).json({
                    success: false,
                    status_code: 401,
                    timestamp: new Date().toISOString(),
                    message: "Client with this phone number already exists"
                });
            }
            if (existingClient.email === email) {
                return res.status(401).json({ message: "Client with this email already exists" });
            }
        }

        // Proceed to update
        const client = await Client.findByIdAndUpdate(
            id,
            {
                first_name, last_name, other_names, age, email, profession, phone, country_id, address, website, client_status, organization, client_photo, description, created_by, updated_by
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!client) {
            return res.status(404).json({ message: "Client not found" });
        }

        res.status(200).json({
            success: true,
            status_code: 200,
            message: "Client updated successfully",
            timestamp: new Date().toISOString(),
            data: client
        });

    } catch (error) {
        // Joi validation or other errors
        if (error.isJoi) {
            return res.status(400).json({ message: error.details[0].message });
        }

        res.status(500).json({
            success: false,
            status_code: 500,
            timestamp: new Date().toISOString(),
            message: "Something went wrong. Please try again later.",
            error: error.message,
        });
    }
};

// // //delete branch
// const deleteSupplier = async (req, res) => {
//     const { id } = req.params;
//     // Validate ID format
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//         return res.status(400).json({ message: "Invalid supplier ID format" });
//     }

//     try {
//         const supplier = await Supplier.findByIdAndDelete(id);
//         if (!supplier) {
//             return res.status(404).json({ message: "Supplier not found" });
//         }
//         // response
//         res.status(200).json({
//             success: true,
//             message: "Supplier deleted successfully",
//             data: supplier,
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
    createClient,
    getAllClients,
    getClientById,
    updateClient,
    // deleteSupplier,
};