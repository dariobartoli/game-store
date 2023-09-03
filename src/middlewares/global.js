const logger = (req, res, next) => {
    console.log("paso siempre por aqui");
    next();
}

module.exports = logger