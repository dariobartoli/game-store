const app = require('../app')
const request = require('supertest')
const { faker } = require('@faker-js/faker');

describe("Auth module", () => {
    console.log(faker.internet.email());

    const payload = {
        firstName: "deze",
        lastName: "pedrazaaa",
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
})