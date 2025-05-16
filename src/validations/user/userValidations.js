const Joi = require('joi');

const userSchemaValidation = Joi.object({
    username: Joi.string().trim().min(3).max(30).required()
        .messages({
            'string.base': 'Username must be a string',
            'string.empty': 'Username is required',
            'string.min': 'Username must be at least 3 characters',
            'any.required': 'Username is required',
        }),

    email: Joi.string().trim().email().required()
        .messages({
            'string.email': 'Email must be a valid email address',
            'any.required': 'Email is required',
        }),
    created_by: Joi.number().integer().optional().messages({
        'number.base': 'Created by must be a number',
    }),
    updated_by: Joi.number().integer().optional().messages({
        'number.base': 'Updated by must be a number',
    }),
    password: Joi.string().min(6).required()
        .messages({
            'string.min': 'Password must be at least 6 characters',
            'any.required': 'Password is required',
        })
});


module.exports = { userSchemaValidation };
