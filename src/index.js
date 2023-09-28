require('dotenv').config()
const express = require('express')
const app = express()
app.use(express.json())
const logger = require('./middlewares/global')

app.use(logger)

const productsRouter = require('./routes/products');
const usersRouter = require('./routes/users');
const categoriesRouter = require('./routes/categories');
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
const publicationRouter = require('./routes/publications');
const messagesRouter = require('./routes/messages');
const cartRouter = require('./routes/carts');
const wishlistRouter = require('./routes/wishlist');
const reviewRouter = require('./routes/reviews');
app.use('/products', productsRouter);
app.use('/users', usersRouter);
app.use('/categories', categoriesRouter);
app.use('/auth', authRouter);
app.use('/admin', adminRouter);
app.use('/publications', publicationRouter);
app.use('/messages', messagesRouter);
app.use('/carts', cartRouter);
app.use('/wishlist', wishlistRouter);
app.use('/reviews', reviewRouter);


try {
    app.listen(process.env.PORT, function(){
        console.log(`La app está montada en el puerto: ${process.env.PORT}`);
    })
} catch (error) {
    console.log("ha ocurrido en error al montar la aplicacion "+error);
}

