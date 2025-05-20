const Joi = require('joi');

// store branch validation
const storeBrandValidation = Joi.object({
    brand_name: Joi.string().trim().required().messages({
        'any.required': 'Brand name is required',
        'string.empty': 'Brand name cannot be empty',
    }),
    brand_register_date: Joi.date().optional().messages({
        'date.base': 'Brand register date must be a valid date',
    }),
    brand_status: Joi.number().integer().optional().messages({
        'number.base': 'Brand status must be a number',
    }),
    brand_description: Joi.string().trim().required().messages({
        'any.required': 'Brand description is required',
        'string.empty': 'Brand description cannot be empty',
    }),
    brand_image: Joi.string().trim().optional(),
    created_by: Joi.number().integer().optional().messages({
        'number.base': 'Created by must be a number',
    }),
    updated_by: Joi.number().integer().optional().messages({
        'number.base': 'Updated by must be a number',
    }),
}).strict().unknown(false);

// update branch validation
const updateBrandValidation = Joi.object({
    brand_name: Joi.string().trim().required().messages({
        'any.required': 'Brand name is required',
        'string.empty': 'Brand name cannot be empty',
    }),
    brand_register_date: Joi.date().optional().messages({
        'date.base': 'Brand register date must be a valid date',
    }),
    brand_status: Joi.number().integer().optional().messages({
        'number.base': 'Brand status must be a number',
    }),
    brand_description: Joi.string().trim().required().messages({
        'any.required': 'Brand description is required',
        'string.empty': 'Brand description cannot be empty',
    }),
    brand_image: Joi.string().trim().optional(),
    created_by: Joi.number().integer().optional().messages({
        'number.base': 'Created by must be a number',
    }),
    updated_by: Joi.number().integer().optional().messages({
        'number.base': 'Updated by must be a number',
    }),
}).strict().unknown(false);

module.exports = {
    storeBrandValidation,
    updateBrandValidation
};
