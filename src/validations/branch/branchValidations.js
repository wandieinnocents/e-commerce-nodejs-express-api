const Joi = require('joi');

// Schema validation
const branchValidationSchema = Joi.object({
    branch_name: Joi.string().trim().required().messages({
        'any.required': 'Branch name is required',
        'string.empty': 'Branch name cannot be empty',
    }),
    branch_status: Joi.number().integer().optional().messages({
        'number.base': 'Branch status must be a number',
    }),
    branch_address: Joi.string().trim().optional(),
    created_by: Joi.number().integer().optional().messages({
        'number.base': 'Created by must be a number',
    }),
    updated_by: Joi.number().integer().optional().messages({
        'number.base': 'Updated by must be a number',
    }),
}).strict().unknown(false);

module.exports = { branchValidationSchema };
