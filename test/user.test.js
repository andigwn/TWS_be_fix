import supertest from "supertest";
import { web } from "../src/application/web.js";
import { logger } from "../src/application/logging.js";
import { createTestUser, getTestUser, removeAllTestUser } from "./test_util.js";
import bcrypt from "bcrypt";

describe('POST /api/users', () => {
    afterEach(async () => {
        await removeAllTestUser();
    });

    it('should can register new user', async () => {
        const result = await supertest(web)
            .post('/api/users')
            .send({
                username: 'andi',
                email: 'andi@gmail.com',
                password: 'andi123',
                name: 'andi gunawan'
            });
        logger.info(result.body);

        expect(result.status).toBe(201);
        expect(result.body.data.username).toBe('andi');
        expect(result.body.data.email).toBe('andi@gmail.com');
        expect(result.body.data.name).toBe('andi gunawan');
        expect(result.body.data.password).toBeUndefined();
    });

    it('should reject if request invalid', async () => {
        const result = await supertest(web)
            .post('/api/users')
            .send({
                username: '',
                email: '',
                password: '',
                name: ''
            });
        logger.info(result.body);
        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject if username already registered', async () => {
        let result = await supertest(web)
            .post('/api/users')
            .send({
                username: 'andi',
                email: 'andi@gmail.com',
                password: 'andi123',
                name: 'andi gunawan'
            });
        logger.info(result.body);

        expect(result.status).toBe(201);
        expect(result.body.data.username).toBe('andi');
        expect(result.body.data.email).toBe('andi@gmail.com');
        expect(result.body.data.name).toBe('andi gunawan');
        expect(result.body.data.password).toBeUndefined();

        result = await supertest(web)
            .post('/api/users')
            .send({
                username: 'andi',
                email: 'andi@gmail.com',
                password: 'andi123',
                name: 'andi gunawan'
            });
        logger.info(result.body);
        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });
})

describe('POST /api/users/login', () => {
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeAllTestUser();
    });

    it('should can login', async () => {
        const result = await supertest(web)
            .post('/api/users/login')
            .send({
                username: 'andi',
                password: 'andi123'
            });
        logger.info(result.body);
        expect(result.status).toBe(200);
        expect(result.body.data.token).toBeDefined();
        expect(result.body.data.token).not.toBe("test");
    });

    it('should reject if username invalid', async () => {
        const result = await supertest(web)
            .post('/api/users/login')
            .send({
                username: 'andi11',
                password: 'andi123'
            });
        logger.info(result.body);
        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject if passsword invalid', async () => {
        const result = await supertest(web)
            .post('/api/users/login')
            .send({
                username: 'andi',
                password: 'andi'
            });
        logger.info(result.body);
        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });
})

describe('GET /api/users/current', () => {
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeAllTestUser();
    });

    it('should can get current user', async () => {
        const result = await supertest(web)
            .get('/api/users/current')
            .set('Authorization', 'test');
        logger.info(result.body);
        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe('andi');
        expect(result.body.data.email).toBe('andi@gmail.com');
    });

    it('should reject if token invalid', async () => {
        const result = await supertest(web)
            .get('/api/users/current')
            .set('Authorization', 'salah');
        logger.info(result.body);
        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });
})

describe('PATCH /api/users/current', () => {
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeAllTestUser();
    });

    it('should can update current user', async () => {
        const result = await supertest(web)
            .patch('/api/users/current')
            .set('Authorization', 'test')
            .send({
                email: 'andi1@gmail.com',
                password: 'andi1234',
                name: 'andi saja'
            });
        logger.info(result.body);
        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe('andi');
        expect(result.body.data.email).toBe('andi1@gmail.com');
        expect(result.body.data.name).toBe('andi saja');

        const user = await getTestUser();
        expect(await bcrypt.compare('andi1234', user.password)).toBe(true);
    });

    it('should can update name current user', async () => {
        const result = await supertest(web)
            .patch('/api/users/current')
            .set('Authorization', 'test')
            .send({
                name: 'andi saja'
            });
        logger.info(result.body);
        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe('andi');
        expect(result.body.data.name).toBe('andi saja');
    });

    it('should can update email current user', async () => {
        const result = await supertest(web)
            .patch('/api/users/current')
            .set('Authorization', 'test')
            .send({
                email: 'andi1@gmail.com'
            });
        logger.info(result.body);
        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe('andi');
        expect(result.body.data.email).toBe('andi1@gmail.com');
    });

    it('should can update password current user', async () => {
        const result = await supertest(web)
            .patch('/api/users/current')
            .set('Authorization', 'test')
            .send({
                password: 'andi1234'
            });
        logger.info(result.body);
        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe('andi');


        const user = await getTestUser();
        expect(await bcrypt.compare('andi1234', user.password)).toBe(true);
    });

    it('should reject if token invalid', async () => {
        const result = await supertest(web)
            .patch('/api/users/current')
            .set('Authorization', 'salah')
            .send({
                email: 'andi1@gmail.com',
                password: 'andi1234',
                name: 'andi saja'
            });
        logger.info(result.body);
        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });
})

describe('DELETE /api/users/logout', () => {
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeAllTestUser();
    });

    it('should can logout', async () => {
        const result = await supertest(web)
            .delete('/api/users/logout')
            .set('Authorization', 'test');
        logger.info(result.body);
        expect(result.status).toBe(200);
        expect(result.body.data).toBe('OK');

        const user = await getTestUser();
        expect(user.token).toBe(null);
    });

    it('should reject if token invalid', async () => {
        const result = await supertest(web)
            .delete('/api/users/logout')
            .set('Authorization', 'salah');
        logger.info(result.body);
        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });
})