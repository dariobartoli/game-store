const Joi = require('joi');

const dataValidation = (req, res, next) => {
    const schema = Joi.object({
        receiver: Joi.string()
            .alphanum()
            .required(),
        message: Joi.string()
            .min(1)
            .required(),
    })
    const validationResult = schema.validate(req.body)
    if (validationResult.error) {
        res.status(404).json({message: validationResult.error.details[0].message})
        console.error(validationResult.error.details);
    }else{
    //console.log('Data is valid');
    next()
    }
}

module.exports = {dataValidation}