const mongoose = require("mongoose");
const Client = require('../../models/Client');
const { clientSchemaValidation } = require('../../validations/client/clientValidations');
const { createdResponse, successResponse, updatedResponse, serverErrorResponse, unauthorizedResponse, notFoundResponse, badRequestResponse } = require('../../utils/responseHandler');

// create client
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
                return unauthorizedResponse(res, {
                    message: "Client with this phone number already exists"
                });
            }
            if (existingClient.email === email) {
                return unauthorizedResponse(res, {
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

        //logged in user
        const logged_in_user_id = req.user._id;

        // Create new client
        const newClient = await Client.create(
            {
                client_code, first_name, last_name, other_names, age, email, profession, phone, country_id, address, website, client_status, organization, client_photo,
                description, created_by: logged_in_user_id, updated_by: null
            });

        // response
        return createdResponse(res, {
            message: "Client created successfully",
            data: newClient
        });
    } catch (error) {
        return serverErrorResponse(res, {
            error: error.message
        });
    }
};

// get all clients
const getAllClients = async (req, res) => {
    try {
        // const clients = await Client.find();
        // const clients = await Client.find().
        //     populate('created_by', 'first_name last_name').
        //     populate('updated_by', 'first_name last_name');

        const clients = await Client.find()
            .populate('created_by', 'username email')   // populate created_by user fields
            .populate('updated_by', 'username email');  // populate updated_by user fields

        const client_count = await Client.countDocuments();

        //if no clients found
        if (!clients || clients.length === 0) {
            return notFoundResponse(res, {
                message: "No clients found",
            });
        }

        // success response 
        return successResponse(res, {
            message: "Clients retrieved successfullyc",
            records_count: client_count,
            data: clients
        });

    } catch (error) {
        console.log(error);
        return serverErrorResponse(res, {
            error: error.message
        });
    }
};

//get client by id
const getClientById = async (req, res) => {
    const { id } = req.params;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return badRequestResponse(res, {
            message: "Invalid client ID format",
        });
    }

    try {
        // const client = await Client.findById(id);
        const client = await Client.findById(id).
            populate('created_by', 'username email').
            populate('updated_by', 'username email');

        if (!client) {
            return notFoundResponse(res, {
                message: "Client not found",
            });
        }

        //success response
        return successResponse(res, {
            message: "Client retrieved successfully",
            data: client
        });

    } catch (error) {
        console.log(error);
        return serverErrorResponse(res, {
            error: error.message
        });
    }
};

//update client 
const updateClient = async (req, res) => {
    const { id } = req.params;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return badRequestResponse(res, {
            message: "Invalid client ID format",
        });
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
                return unauthorizedResponse(res, {
                    message: "Client with this phone number already exists"
                });
            }
            if (existingClient.email === email) {
                return unauthorizedResponse(res, {
                    message: "Client with this email already exists"
                });
            }
        }

        //logged in user
        const logged_in_user_id = req.user._id;

        // Proceed to update
        const client = await Client.findByIdAndUpdate(
            id,
            {
                first_name, last_name, other_names, age, email, profession, phone, country_id, address, website, client_status, organization, client_photo,
                description, created_by: logged_in_user_id, updated_by: logged_in_user_id
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!client) {
            return notFoundResponse(res, {
                message: "Client not found",
            });
        }

        // response
        return updatedResponse(res, {
            message: "Client updated successfully",
            data: client
        });


    } catch (error) {
        console.log(error);
        return serverErrorResponse(res, {
            error: error.message
        });
    }
};

//delete client
const deleteClient = async (req, res) => {
    const { id } = req.params;
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return badRequestResponse(res, {
            message: "Invalid client ID format",
        });
    }

    try {
        const client = await Client.findByIdAndDelete(id);
        if (!client) {
            return notFoundResponse(res, {
                message: "Client not found",
            });
        }

        return successResponse(res, {
            message: "Client deleted successfully",
            data: client
        });

    } catch (error) {
        console.log(error);
        return serverErrorResponse(res, {
            error: error.message
        });
    }
};

module.exports = {
    createClient,
    getAllClients,
    getClientById,
    updateClient,
    deleteClient,
};