const Joi = require('joi');

const userLogger = (req, res, next) =>{
    //console.log("it go for users");
    next()
}

const dataValidation = (req, res, next) => {
    const schema = Joi.object({
        firstName: Joi.string()
            .min(3)
            .max(30)
            .required(),
        lastName: Joi.string()
            .min(3)
            .max(30)
            .required(),
        
        password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
            .required(),
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
            .max(50)
            .required(),
        description: Joi.string()
            .min(3)
            .max(250)
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

const dataUpdate= (req, res, next) => {
    const schema = Joi.object({
        firstName: Joi.string()
            .min(3)
            .max(30),
        lastName: Joi.string()
            .min(3)
            .max(30),
        
        password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
            .max(50),
        nickName: Joi.string()
            .min(3)
            .max(20),
        description: Joi.string()
            .min(3)
            .max(250)
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

const isAlphaNum = (req, res, next) => {
    const schema = Joi.string().alphanum().required();
    const validationResult = schema.validate(req.params.id)
    if (validationResult.error) {
        res.status(404).json({message: validationResult.error.details[0].message})
        console.error(validationResult.error.details);
    }else{
        //console.log('Data is valid');
        next()
    }
}


module.exports = {userLogger, dataValidation, isAlphaNum, dataUpdate}

