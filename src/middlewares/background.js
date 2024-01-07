const Joi = require('joi');

const dataValidation = (req, res, next) => {
    const schema = Joi.object({
        url: Joi.string()
            .required(),
        name: Joi.string()
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