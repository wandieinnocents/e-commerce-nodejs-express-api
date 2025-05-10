const Joi = require('joi');


// Schema validation
const supplierSchemaValidation = Joi.object({
    supplier_name: Joi.string().trim().required().messages({
        'any.required': 'Supplier name is required',
        'string.empty': 'Supplier name cannot be empty',
    }),
    supplier_email: Joi.string().email().trim().optional().messages({
        'string.email': 'Supplier email must be a valid email',
        'string.empty': 'Supplier email cannot be empty',
    }),
    supplier_phone: Joi.string().trim().required().messages({
        'any.required': 'Supplier phone is required',
        'string.empty': 'Supplier phone cannot be empty',
    }),
    supplier_city: Joi.string().trim().optional(),
    supplier_address: Joi.string().trim().optional(),
    supplier_country: Joi.string().trim().optional(),
    supplier_organization: Joi.string().trim().optional(),
    supplier_status: Joi.number().integer().optional().messages({
        'number.base': 'Supplier status must be a number',
    }),
    supplier_description: Joi.string().trim().optional(),
    supplier_website_url: Joi.string().uri().optional().messages({
        'string.uri': 'Supplier website URL must be a valid URL',
        'string.empty': 'Supplier website URL cannot be empty',
    }),
    supplier_image: Joi.string().uri().optional().messages({
        'string.uri': 'Supplier image must be a valid URL',
        'string.empty': 'Supplier image cannot be empty',
    }),

    created_by: Joi.number().integer().optional().messages({
        'number.base': 'Created by must be a number',
    }),
    updated_by: Joi.number().integer().optional().messages({
        'number.base': 'Updated by must be a number',
    }),
}).strict().unknown(false);

module.exports = { supplierSchemaValidation };
