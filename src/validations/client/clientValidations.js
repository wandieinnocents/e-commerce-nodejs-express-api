const Joi = require('joi');


// Schema validation
const clientSchemaValidation = Joi.object({
    first_name: Joi.string().trim().required().messages({
        'any.required': 'First name is required',
        'string.empty': 'First name cannot be empty',
    }),
    last_name: Joi.string().trim().optional(),
    other_names: Joi.string().trim().optional(),
    age: Joi.number().integer().optional().messages({
        'number.base': 'Age must be a number',
    }),
    email: Joi.string().email().trim().optional().messages({
        'string.email': 'Email must be a valid email',
        'string.empty': 'Email cannot be empty',
    }),
    profession: Joi.string().trim().optional(),
    phone: Joi.string().trim().required().messages({
        'any.required': 'Phone number is required',
        'string.empty': 'Phone number cannot be empty',
    }),
    country_id: Joi.number().integer().optional().messages({
        'number.base': 'Country ID must be a number',
    }),
    address: Joi.string().trim().optional(),
    website: Joi.string().uri().optional().messages({
        'string.uri': 'Website must be a valid URL',
        'string.empty': 'Website cannot be empty',
    }),
    client_status: Joi.number().integer().optional().messages({
        'number.base': 'Client status must be a number',
        'number.integer': 'Client status must be an integer',
        'number.min': 'Client status must be a positive number',
    }),
    organization: Joi.string().trim().optional(),
    client_photo: Joi.string().uri().optional().messages({
        'string.uri': 'Client photo must be a valid URL',
        'string.empty': 'Client photo cannot be empty',
    }),
    description: Joi.string().trim().optional(),
    created_by: Joi.number().integer().optional().messages({
        'number.base': 'Created by must be a number',
    }),
    updated_by: Joi.number().integer().optional().messages({
        'number.base': 'Updated by must be a number',
    }),

}).strict().unknown(false);

module.exports = { clientSchemaValidation };
