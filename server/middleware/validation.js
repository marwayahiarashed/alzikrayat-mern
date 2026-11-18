const Joi = require('joi');
const fs = require('fs');

const validateRegister = (req, res, next) => {
    const schema = Joi.object({
        firstName: Joi.string().min(2).max(50).required(),
        lastName: Joi.string().min(2).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    next();
};

const validateLogin = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    next();
};

const validatePhoto = (req, res, next) => {
    const schema = Joi.object({
        title: Joi.string().min(2).max(100).required(),
        description: Joi.string().allow('')
    });
    const { error } = schema.validate(req.body);
    if (error) {
        // remove the file that multer already saved
        if (req.file) fs.unlink(req.file.path, () => {});
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

const validateComment = (req, res, next) => {
    const schema = Joi.object({
        comment: Joi.string().min(1).max(500).required()
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    next();
};

module.exports = { validateRegister, validateLogin, validatePhoto, validateComment };