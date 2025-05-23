const Joi = require('joi');

// store 
const storeProductCategoryValidation = Joi.object({
    parent_product_category_id: Joi.string().length(24).required(),

    product_category_name: Joi.string().trim().required().messages({
        'any.required': 'Product category name is required',
        'string.empty': 'Product category name cannot be empty',
    }),
    product_category_status: Joi.number().integer().optional().messages({
        'number.base': 'Product category status must be a number',
    }),
    created_by: Joi.number().integer().optional().messages({
        'number.base': 'Created by must be a number',
    }),
    updated_by: Joi.number().integer().optional().messages({
        'number.base': 'Updated by must be a number',
    }),
}).strict().unknown(false);

// update 
const updateProductCategoryValidation = Joi.object({
    parent_product_category_id: Joi.number().integer().optional().messages({
        'any.required': 'Parent product category  is required',
    }),
    product_category_name: Joi.string().trim().required().messages({
        'any.required': 'Product category name is required',
        'string.empty': 'Product category name cannot be empty',
    }),
    product_category_status: Joi.number().integer().optional().messages({
        'number.base': 'Product category status must be a number',
    }),
    created_by: Joi.number().integer().optional().messages({
        'number.base': 'Created by must be a number',
    }),
    updated_by: Joi.number().integer().optional().messages({
        'number.base': 'Updated by must be a number',
    }),
}).strict().unknown(false);

module.exports = {
    storeProductCategoryValidation,
    updateProductCategoryValidation
};
