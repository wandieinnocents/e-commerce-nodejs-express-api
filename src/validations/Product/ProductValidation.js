const Joi = require('joi');

const productValidationSchema = Joi.object({

    name: Joi.string()
        .trim()
        .required()
        .messages({
            'string.base': 'Product name must be a string.',
            'string.empty': 'Product name cannot be empty.',
            'any.required': 'Product name is required.'
        }),

    supplier_id: Joi.string()
        .alphanum()
        .required()
        .messages({
            'string.base': 'Supplier ID must be a string.',
            'string.empty': 'Supplier ID cannot be empty.',
            'string.alphanum': 'Supplier ID must contain only alphanumeric characters.',
            'any.required': 'Supplier ID is required.'
        }),


    brand_id: Joi.string()
        .length(24)
        .required()
        .messages({
            'string.base': 'Brand ID must be a string.',
            'string.empty': 'Brand ID cannot be empty.',
            'string.length': 'Brand ID must be 24 characters long.',
            'any.required': 'Brand ID is required.'
        }),

    branch_id: Joi.string()
        .required()
        .messages({
            'string.base': 'Branch ID must be a string.',
            'string.empty': 'Branch ID cannot be empty.',
            'any.required': 'Branch ID is required.'
        }),

    parent_product_category_id: Joi.string()
        .required()
        .messages({
            'string.base': 'Parent product category ID must be a string.',
            'string.empty': 'Parent product category ID cannot be empty.',
            'any.required': 'Parent product category ID is required.'
        }),

    product_category_id: Joi.string()
        .required()
        .messages({
            'string.base': 'Product category ID must be a string.',
            'string.empty': 'Product category ID cannot be empty.',
            'any.required': 'Product category ID is required.'
        }),

    unit_id: Joi.string()
        .required()
        .messages({
            'string.base': 'Unit ID must be a string.',
            'string.empty': 'Unit ID cannot be empty.',
            'any.required': 'Unit ID is required.'
        }),


    expiry_date: Joi.alternatives().try(
        Joi.date(),
        Joi.string().isoDate()
    ).optional().messages({
        'date.base': 'Product expiry date must be a valid date.'
    }),


    stock_quantity: Joi.number()
        .integer()
        .allow(null)
        .default(null)
        .messages({
            'number.base': 'Product stock quantity must be a number.',
            'number.integer': 'Product stock quantity must be an integer.',
        }),

    cost_price: Joi.number()
        .precision(2)
        .min(0)
        .allow(null)
        .default(null)
        .messages({
            'number.base': 'Product cost price must be a number.',
            'number.precision': 'Product cost price must have at most 2 decimal places.',
            'number.min': 'Product cost price cannot be negative.'
        }),

    selling_price: Joi.number()
        .precision(2)
        .min(0)
        .allow(null)
        .default(null)
        .greater(Joi.ref('cost_price'))
        .messages({
            'number.base': 'Product selling price must be a number.',
            'number.precision': 'Product selling price must have at most 2 decimal places.',
            'number.min': 'Product selling price cannot be negative.',
            'number.greater': 'Product selling price must be greater than product cost price.'
        }),

    status: Joi.number()
        .valid(0, 1)
        .default(1)
        .messages({
            'number.base': 'Product status must be a number.',
            'any.only': 'Product status must be either 0 (Inactive) or 1 (Active).'
        }),

    description: Joi.string()
        .allow(null, '')
        .trim()
        .default(null)
        .messages({
            'string.base': 'Product description must be a string.'
        }),

    stock_alert: Joi.number()
        .integer()
        .allow(null)
        .default(null)
        .messages({
            'number.base': 'Product stock alert must be a number.',
            'number.integer': 'Product stock alert must be an integer.',
        }),

    featured_image: Joi.any()
        .allow(null)
        .default(null),

    image_gallery: Joi.array()
        .items(Joi.any())
        .allow(null)
        .default(null),

    created_by: Joi.number().integer().optional().messages({
        'number.base': 'Created by must be a number',
    }),
    updated_by: Joi.number().integer().optional().messages({
        'number.base': 'Updated by must be a number',
    }),
}).strict().unknown(false);

module.exports = productValidationSchema;