const Joi = require('joi');

// store staff position validation
const storeStaffPositionValidation = Joi.object({
    position_name: Joi.string().trim().required().messages({
        'any.required': 'Position name is required',
        'string.empty': 'Position name cannot be empty',
    }),
    status: Joi.number().integer().optional().messages({
        'number.base': 'Status must be a number',
    }),
    created_by: Joi.number().integer().optional().messages({
        'number.base': 'Created by must be a number',
    }),
    updated_by: Joi.number().integer().optional().messages({
        'number.base': 'Updated by must be a number',
    }),
}).strict().unknown(false);

//update staff position validation
const updateStaffPositionValidation = Joi.object({
    position_name: Joi.string().trim().optional().messages({
        'string.empty': 'Position name cannot be empty',
    }),
    status: Joi.number().integer().optional().messages({
        'number.base': 'Status must be a number',
    }),
    created_by: Joi.number().integer().optional().messages({
        'number.base': 'Created by must be a number',
    }),
    updated_by: Joi.number().integer().optional().messages({
        'number.base': 'Updated by must be a number',
    }),
}).strict().unknown(false);

module.exports = { storeStaffPositionValidation, updateStaffPositionValidation };
