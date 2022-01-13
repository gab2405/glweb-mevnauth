import { Request, Response, NextFunction } from 'express';

const Joi = require('joi');

module.exports = {
    /**
     * Validate the bodys parameter for PUT or POST requests
     * @param {{validate: Function}} schema
     * @returns {(req: e.Request, res: e.Response, next: e.NextFunction) => e.Response<any, Record<string, any>>}
     */
    validateBody: (schema: {
        validate: Function;
    }) => {
        return (req: Request, res: Response, next: NextFunction) => {
            const result = schema.validate(req.body);
            if (result.error) {
                return res.status(400).json(result.error);
            }

            req.body = result.value;
            next();
        }
    },

    schemas: {
        loginSchema: Joi.object({
            email: Joi.string().min(6).required().email(),
            password: Joi.string().min(6).required()
        }),
        registerSchema: Joi.object({
            name: Joi.string().min(6).required(),
            email: Joi.string().min(6).required().email(),
            password: Joi.string().min(6).required()
        }),
    }
}
