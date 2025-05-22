const Joi = require('joi');

// store branch validation
const storeParentProductCategoryValidation = Joi.object({
    parent_product_category_name: Joi.string().trim().required().messages({
        'any.required': 'Parent category name is required',
        'string.empty': 'Parent category cannot be empty',
    }),

    parent_product_category_status: Joi.number().integer().optional().messages({
        'number.base': 'Parent category status must be a number',
    }),

    created_by: Joi.number().integer().optional().messages({
        'number.base': 'Created by must be a number',
    }),
    updated_by: Joi.number().integer().optional().messages({
        'number.base': 'Updated by must be a number',
    }),
}).strict().unknown(false);

// update branch validation
const updateParentProductCategoryValidation = Joi.object({
    parent_product_category_name: Joi.string().trim().required().messages({
        'any.required': 'Parent category name is required',
        'string.empty': 'Parent category cannot be empty',
    }),

    parent_product_category_status: Joi.number().integer().optional().messages({
        'number.base': 'Parent category status must be a number',
    }),

    created_by: Joi.number().integer().optional().messages({
        'number.base': 'Created by must be a number',
    }),
    updated_by: Joi.number().integer().optional().messages({
        'number.base': 'Updated by must be a number',
    }),
}).strict().unknown(false);

module.exports = {
    storeParentProductCategoryValidation,
    updateParentProductCategoryValidation
};
