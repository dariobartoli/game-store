const Joi = require('joi');

const dataValidation2 = (req, res, next) => {
    const schema = Joi.object({
        userName: Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required(),
        lastName: Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required(),
        
        password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
            .required(),
    
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
            .required()
    })
    const validationResult = schema.validate(req.body)
    if (validationResult.error) {
        res.status(404).json({message: validationResult.error.details[0].message})
        console.error(validationResult.error.details);
    }else{
    console.log('Data is valid');
    next()
    }
}

const productLogger = (req, res, next) =>{
    console.log("it go for products");
    next()
}

const dataValidation = (req, res, next) => {
    const schema = Joi.object({
        gameName: Joi.string()
            .min(3)
            .max(30)
            .required(),
        description: Joi.string()
            .min(1)
            .max(500)
            .required(),
        price: Joi.number()
            .min(1)
            .max(1000)
            .precision(2) //precisar la cantidad de decimales que puede tener el precio
            .required(),
        category: Joi.string()
            .alphanum()
            .required()
    })
    const validationResult = schema.validate(req.body)
    if (validationResult.error) {
        res.status(404).json({message: validationResult.error.details[0].message})
        console.error(validationResult.error.details);
    }else{
        console.log('Data is valid');
        next()
    }
}


const isAlphaNum = (req, res, next) => {
    const schema = Joi.string().alphanum().required();
    const validationResult = schema.validate(req.params.id)
    if (validationResult.error) {
        res.status(404).json({message: validationResult.error.details[0].message})
        console.error(validationResult.error.details);
    }else{
        console.log('Data is valid');
        next()
    }
}

module.exports = {dataValidation, productLogger, isAlphaNum}