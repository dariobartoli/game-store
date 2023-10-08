const app = require('../app')
const request = require('supertest')
const { faker } = require('@faker-js/faker');
require('dotenv').config()
const path = require('path');

describe("Auth module", () => {

    const payload = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: "123456",
    }
    test('resgister test', async () => {
        const response = await request(app)
            .post('/auth/register')
            .set('Content-type', 'application/json')
            .send(payload)
        expect(response.status).toBe(201)
        expect(response.body.sanitizedUser._id).toBeDefined()
    })

    test('already register', async () => {
        const response = await request(app)
            .post('/auth/register')
            .set('Content-type', 'application/json')
            .send(payload)
        expect(response.status).toBe(409)
    })

    test('login', async() => {
        const response = await request(app)
            .post('/auth/login')
            .set('Content-type', 'application/json')
            .send(payload)
        expect(response.status).toBe(201)
    })

    test('password incorrect', async () => {
        const response = await request(app)
            .post('/auth/login')
            .set('Content-type', 'application/json')
            .send({
                emailOrNick: payload.email,
                password: 'otra'
            })
        expect(response.status).toBe(401)
    })
})

describe("Category Module", () => {
    const payload = {
        nameCategory: faker.commerce.productName(),
        description: faker.commerce.productDescription()
    }

    test('create category', async () =>{
        const response = await request(app)
            .post('/categories')
            .set('Content-type', 'application/json')
            .send(payload)
        expect(response.status).toBe(201)
    })

    test('category already created', async () =>{
        const response = await request(app)
            .post('/categories')
            .set('Content-type', 'application/json')
            .send(payload)
        expect(response.status).toBe(409)
    })

    test('get categories', async () =>{
        const response = await request(app)
            .get('/categories')
        expect(response.status).toBe(200)
        expect(response.body.categories).toEqual(expect.any(Array))
    })
})


describe("product module", () => {
    let token
    let product_id
    const imagePath = path.join(__dirname, '../public/images/test.jpeg')
    const productPayload = {
        imagen: imagePath,
        gameName: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        category: '6522f4ba1516743d25e6b708',
        variant: faker.commerce.productAdjective(),
        price: faker.commerce.price(),
    }

    beforeAll(async () => {
        const payload = {
            emailOrNick: 'test@hotmail.com',
            password: '123456'
        }
        const response = await request(app)
            .post('/auth/login')
            .set('Content-type', 'application/json')
            .send(payload)
        token = response.body.token
    })
    
    test('get all products', async() => {
        const response = await request(app)
            .get('/products')
        expect(response.status).toBe(200)
        expect(response.body.products).toEqual(expect.any(Array))
    })

    test('add product', async() => {
        const response = await request(app)
            .post('/products')
            .set('Content-type', 'multipart/form-data')
            .attach('imagen', productPayload.imagen)
            .field('gameName', productPayload.gameName)
            .field('description', productPayload.description)
            .field('category', productPayload.category)
            .field('variant[0].edition', productPayload.variant)
            .field('variant[0].price', productPayload.price)
            .field('variant[1].edition', productPayload.variant)
            .field('variant[1].price', productPayload.price)
        expect(response.status).toBe(201)
        expect(response.body.product._id).toBeDefined()

        product_id = response.body.product._id
    })

    test('image not found', async() => {
        const response = await request(app)
            .post('/products')
            .set('Content-type', 'multipart/form-data')
            .field('gameName', productPayload.gameName)
            .field('description', productPayload.description)
            .field('category', productPayload.category)
            .field('variant[0].edition', productPayload.variant)
            .field('variant[0].price', productPayload.price)
            .field('variant[1].edition', productPayload.variant)
            .field('variant[1].price', productPayload.price)
        expect(response.status).toBe(400)
    })

/*     test('product already created', async() => {
        const response = await request(app)
            .post('/products')
            .set('Content-type', 'multipart/form-data')
            .attach('imagen', productPayload.imagen)
            .field('gameName', productPayload.gameName)
            .field('description', productPayload.description)
            .field('category', productPayload.category)
            .field('variant[0].edition', productPayload.variant)
            .field('variant[0].price', productPayload.price)
            .field('variant[1].edition', productPayload.variant)
            .field('variant[1].price', productPayload.price)
        expect(response.status).toBe(409)
    }) */

    test('get one product', async () =>{
        const response = await request(app)
            .get('/products/product/' + product_id)
        expect(response.status).toBe(200)
    })

    test('delete product', async () =>{
        const response = await request(app)
            .delete('/products/' + product_id)
        expect(response.status).toBe(200)
    })
})


describe("Message Module", () => {
    let token

    beforeAll(async () => {
        const payload = {
            emailOrNick: 'test@hotmail.com',
            password: '123456'
        }
        const response = await request(app)
            .post('/auth/login')
            .set('Content-type', 'application/json')
            .send(payload)
        token = response.body.token
    })

    const payload = {
        receiver: '6522e7795bdaffcde684be8f',
        message: faker.lorem.text()
    }

    test('new message', async () => {
        const response = await request(app)
            .post('/messages')
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send(payload)
        expect(response.status).toBe(201)
    })

    test("isn't yout friend", async () => {
        const response = await request(app)
            .post('/messages')
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                receiver: '6522f751622e71fc127fa1b0',
                message: "isn't yout friend"
            })
        expect(response.status).toBe(400)
    })

    test('get messages', async () =>{
        const response = await request(app)
            .get('/messages/all')
            .set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(200)
        expect(response.body.allMessages).toEqual(expect.any(Array))
    })

    test('get one chat', async () =>{
        const response = await request(app)
            .get('/messages/6523079e92ecc40ec886aa84')
            .set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(200)
    })
})

describe('Publication Module', () => {
    let token
    let publication_id

    beforeAll(async () => {
        const payload = {
            emailOrNick: 'test@hotmail.com',
            password: '123456'
        }
        const response = await request(app)
            .post('/auth/login')
            .set('Content-type', 'application/json')
            .send(payload)
        token = response.body.token
    })

    test('create publication', async () => {
        const response = await request(app)
            .post('/publications')
            .set('Content-type', 'multipart/form-data')
            .set('Authorization', `Bearer ${token}`)
            .field('title', faker.lorem.word())
            .field('text', faker.lorem.text())
        expect(response.status).toBe(201)
        expect(response.body.publication._id).toBeDefined()
        publication_id = response.body.publication._id
    })

    test('modify publication', async () => {
        const response = await request(app)
            .put('/publications')
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                id: publication_id,
                title: faker.lorem.word(),
                text: faker.lorem.text()
            })
        expect(response.status).toBe(200)
        expect(response.body.publication._id).toBeDefined()
    })

    test('like publication', async() => {
        const response = await request(app)
            .post('/publications/like')
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                id: publication_id,
            })
        expect(response.status).toBe(201)
    })

    test('already like publication', async() => {
        const response = await request(app)
            .post('/publications/like')
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                id: publication_id,
            })
        expect(response.status).toBe(403)
    })

    test('comment publication', async() => {
        const response = await request(app)
            .post('/publications/comment')
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                id: publication_id,
                text: faker.lorem.text()
            })
        expect(response.status).toBe(201)
    })

    test('get profile publication', async () => {
        const response = await request(app)
            .get('/publications')
            .set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(200)
    })

    test('all publications', async () => {
        const response = await request(app)
            .get('/publications/all')
        expect(response.status).toBe(200)
    })

    test('delete publication', async () => {
        const response = await request(app)
            .delete('/publications')
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                id: publication_id,
            })
        expect(response.status).toBe(200)
    })

})

describe('User Module', () => {
    let token
    let friend_id
    beforeAll(async () => {
        const payload = {
            emailOrNick: 'test@hotmail.com',
            password: '123456'
        }
        const response = await request(app)
            .post('/auth/login')
            .set('Content-type', 'application/json')
            .send(payload)
        token = response.body.token

        const response2 = await request(app)
            .post('/auth/register')
            .set('Content-type', 'application/json')
            .send({
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                email: faker.internet.email(),
                password: "123456",
            })
        friend_id = response2.body.sanitizedUser._id
    })

    test('user profile', async () => {
        const response = await request(app)
            .get('/users')
            .set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(200)
    })

    test('add friend', async () => {
        const response = await request(app)
            .post('/users/user/add')
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                id: friend_id
            })
        expect(response.status).toBe(201)
    })
    test('add friend: already sent request', async () => {
        const response = await request(app)
            .post('/users/user/add')
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                id: friend_id
            })
        expect(response.status).toBe(400)
    })
    test('add friend: is already your friend', async () => {
        const response = await request(app)
            .post('/users/user/add')
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                id: '6522e7795bdaffcde684be8f'
            })
        expect(response.status).toBe(400)
    })
    test('add friend: is your id', async () => {
        const response = await request(app)
            .post('/users/user/add')
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                id: '6522f16f46b744d45585f8a7'
            })
        expect(response.status).toBe(403)
    })

    test('modify info profile', async () => {
        const response = await request(app)
            .put('/users')
            .set('Content-type', 'multipart/form-data')
            .set('Authorization', `Bearer ${token}`)
            .field('nickName', faker.internet.userName())
        expect(response.status).toBe(200)
    })

})


describe('Wishlist Module', () => {
    let token
    beforeAll(async () => {
        const payload = {
            emailOrNick: 'test@hotmail.com',
            password: '123456'
        }
        const response = await request(app)
            .post('/auth/login')
            .set('Content-type', 'application/json')
            .send(payload)
        token = response.body.token
    })

    test('add to wishlist', async () => {
        const response = await request(app)
            .post('/wishlist')
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                id: '652301654818e6edf2feb155'
            })
        expect(response.status).toBe(201)
    })

    test('add to wishlist: already in your wishlist', async () => {
        const response = await request(app)
            .post('/wishlist')
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                id: '652301654818e6edf2feb155'
            })
        expect(response.status).toBe(409)
    })

    test('get wishlist', async () => {
        const response = await request(app)
            .get('/wishlist')
            .set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(200)
        expect(response.body.wishlist).toEqual(expect.any(Array))
    })

    test('delete to wishlist', async () => {
        const response = await request(app)
            .delete('/wishlist')
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                id: '652301654818e6edf2feb155'
            })
        expect(response.status).toBe(200)
    })

    test('remove to wishlist: isnt in your wishlist', async () => {
        const response = await request(app)
            .delete('/wishlist')
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                id: '652301654818e6edf2feb155'
            })
        expect(response.status).toBe(409)
    })
})


describe('Cart Module', () => {
    let token
    beforeAll(async () => {
        const payload = {
            emailOrNick: 'test@hotmail.com',
            password: '123456'
        }
        const response = await request(app)
            .post('/auth/login')
            .set('Content-type', 'application/json')
            .send(payload)
        token = response.body.token
    })

    test('add to cart', async () => {
        const response = await request(app)
            .post('/carts')
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                id: "652301654818e6edf2feb155",
                variant: "652301654818e6edf2feb156"
            })
        expect(response.status).toBe(201)
    })

    test('add to cart: is already in your cart', async () => {
        const response = await request(app)
            .post('/carts')
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                id: "652301654818e6edf2feb155",
                variant: "652301654818e6edf2feb156"
            })
        expect(response.status).toBe(409)
    })

    test('add to cart: invalid data variant =! game', async () => {
        const response = await request(app)
            .post('/carts')
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                id: "652301654818e6edf2feb155",
                variant: "65230200856902ca8d9dd271"
            })
        expect(response.status).toBe(400)
    })

    test('get cart', async () => {
        const response = await request(app)
            .get('/carts')
            .set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(200)
    })

    test('remove to cart', async () => {
        const response = await request(app)
            .delete('/carts/clean')
            .set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(200)
    })

    test('remove to cart: cart empty', async () => {
        const response = await request(app)
            .delete('/carts/clean')
            .set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(400)
    })

    test('get cart: cart empty', async () => {
        const response = await request(app)
            .get('/carts')
            .set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(400)
    })
})