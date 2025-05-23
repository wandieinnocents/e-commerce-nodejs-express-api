const Joi = require('joi');

// store unit validation
const storeUnitValidation = Joi.object({
    name: Joi.string().trim().required().messages({
        'any.required': 'Unit name is required',
        'string.empty': 'Unit name cannot be empty',
    }),
    status: Joi.number().integer().optional().messages({
        'number.base': 'Brand status must be a number',
    }),
    created_by: Joi.number().integer().optional().messages({
        'number.base': 'Created by must be a number',
    }),
    updated_by: Joi.number().integer().optional().messages({
        'number.base': 'Updated by must be a number',
    }),
}).strict().unknown(false);

// update unit validation
const updateUnitValidation = Joi.object({
    name: Joi.string().trim().required().messages({
        'any.required': 'Unit name is required',
        'string.empty': 'Unit name cannot be empty',
    }),
    status: Joi.number().integer().optional().messages({
        'number.base': 'Brand status must be a number',
    }),
    created_by: Joi.number().integer().optional().messages({
        'number.base': 'Created by must be a number',
    }),
    updated_by: Joi.number().integer().optional().messages({
        'number.base': 'Updated by must be a number',
    }),
}).strict().unknown(false);

module.exports = {
    storeUnitValidation,
    updateUnitValidation
};
