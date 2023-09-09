require('dotenv').config()
const express = require('express')
const app = express()
app.use(express.json())
const logger = require('./middlewares/global')

app.use(logger)

const productsRouter = require('./routes/productsRouter');
const usersRouter = require('./routes/usersRouter');
const categoriesRouter = require('./routes/categoriesRouter');
app.use('/products', productsRouter);
app.use('/users', usersRouter);
app.use('/categories', categoriesRouter);


try {
    app.listen(process.env.PORT, function(){
        console.log(`La app está montada en el puerto: ${process.env.PORT}`);
    })
} catch (error) {
    console.log("ha ocurrido en error al montar la aplicacion "+error);
}
