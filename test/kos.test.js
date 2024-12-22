import supertest from "supertest";
import { logger } from "../src/application/logging";
import { web } from "../src/application/web";
import { createManyTestKos, createTestKos, createTestUser, getTestKos, removeAllTestKos, removeAllTestUser } from "./test_util"

describe('POST /api/kos', () => {
    beforeEach(async () => {
        await createTestUser();
    })
    afterEach(async () => {
        await removeAllTestKos();
        await removeAllTestUser();
    });
    it('should can create new kos', async () => {

        const result = await supertest(web)
            .post('/api/kos')
            .set('Authorization', 'test')
            .send({
                nama_kos: 'HR kos',
                pemilik_kos: 'Bapak saya',
                alamat_kos: 'Jl. HR',
                description: 'kos murah',
                image: 'kos.png'
            })
        logger.info(result.body)
        expect(result.status).toBe(201)
        expect(result.body.data.id).toBeDefined();
        expect(result.body.data.nama_kos).toBe('HR kos')
        expect(result.body.data.pemilik_kos).toBe('Bapak saya')
        expect(result.body.data.alamat_kos).toBe('Jl. HR')
        expect(result.body.data.description).toBe('kos murah')
        expect(result.body.data.image).toBe('kos.png')
    })

    it('should reject if request invalid', async () => {

        const result = await supertest(web)
            .post('/api/kos')
            .set('Authorization', 'test')
            .send({
                nama_kos: '',
                pemilik_kos: 'Bapak saya',
                alamat_kos: 'Jl. HR',
                description: 'kos murah',
                image: 'kos.png'
            })
        logger.info(result.body)
        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    })
})

describe('GET /api/kos/:kosId', () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestKos();
    })
    afterEach(async () => {
        await removeAllTestKos();
        await removeAllTestUser();
    });

    it('should can get kos', async () => {
        const tesKos = await getTestKos();
        const result = await supertest(web)
            .get('/api/kos/' + tesKos.id)
            .set('Authorization', 'test')
        logger.info(result.body)
        expect(result.status).toBe(200)
        expect(result.body.data.id).toBe(tesKos.id);
        expect(result.body.data.nama_kos).toBe(tesKos.nama_kos)
        expect(result.body.data.pemilik_kos).toBe(tesKos.pemilik_kos)
        expect(result.body.data.alamat_kos).toBe(tesKos.alamat_kos)
        expect(result.body.data.description).toBe(tesKos.description)
        expect(result.body.data.image).toBe(tesKos.image)
    });

    it('should reject if kos not found', async () => {
        const tesKos = await getTestKos();
        const result = await supertest(web)
            .get('/api/kos/' + (tesKos.id + 1))
            .set('Authorization', 'test')
        logger.info(result.body)
        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined();
    });

})

describe('PUT /api/kos/:kosId', () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestKos();
    })
    afterEach(async () => {
        await removeAllTestKos();
        await removeAllTestUser();
    });

    it('should can update kos', async () => {
        const tesKos = await getTestKos();
        const result = await supertest(web)
            .put('/api/kos/' + tesKos.id)
            .set('Authorization', 'test')
            .send({
                nama_kos: 'HR kos1',
                pemilik_kos: 'Bapak saya1',
                alamat_kos: 'Jl. HR1',
                description: 'kos murah1',
                image: 'rumah.png'
            })
        logger.info(result.body)
        expect(result.status).toBe(200)
        expect(result.body.data.id).toBe(tesKos.id);
        expect(result.body.data.nama_kos).toBe('HR kos1')
        expect(result.body.data.pemilik_kos).toBe('Bapak saya1')
        expect(result.body.data.alamat_kos).toBe('Jl. HR1')
        expect(result.body.data.description).toBe('kos murah1')
        expect(result.body.data.image).toBe('rumah.png')
    });

    it('should reject if request invalid', async () => {
        const tesKos = await getTestKos();
        const result = await supertest(web)
            .put('/api/kos/' + tesKos.id)
            .set('Authorization', 'test')
            .send({
                nama_kos: '',
                pemilik_kos: '',
                alamat_kos: '',
                description: '',
                image: ''
            })
        logger.info(result.body)
        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject if request invalid', async () => {
        const tesKos = await getTestKos();
        const result = await supertest(web)
            .put('/api/kos/' + (tesKos.id + 1))
            .set('Authorization', 'test')
            .send({
                nama_kos: 'HR kos1',
                pemilik_kos: 'Bapak saya1',
                alamat_kos: 'Jl. HR1',
                description: 'kos murah1',
                image: 'rumah.png'
            })
        logger.info(result.body)
        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined();
    });
})

describe('DELETE /api/kos/:kosId', () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestKos();
    })
    afterEach(async () => {
        await removeAllTestKos();
        await removeAllTestUser();
    });

    it('should can delete kos', async () => {
        let tesKos = await getTestKos();
        const result = await supertest(web)
            .delete('/api/kos/' + tesKos.id)
            .set('Authorization', 'test')
        logger.info(result.body)
        expect(result.status).toBe(200)
        expect(result.body.data).toBe("OK")

        tesKos = await getTestKos();
        expect(tesKos).toBeNull();
    });

    it('should reject if kos not found', async () => {
        let tesKos = await getTestKos();
        const result = await supertest(web)
            .delete('/api/kos/' + (tesKos.id + 1))
            .set('Authorization', 'test')
        logger.info(result.body)
        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined();
    });
})

describe('GET /api/kos', () => {
    beforeEach(async () => {
        await createTestUser();
        await createManyTestKos();
    })
    afterEach(async () => {
        await removeAllTestKos();
        await removeAllTestUser();
    });

    it('should can search without parameter', async () => {
        const result = await supertest(web)
            .get('/api/kos')
            .set('Authorization', 'test')
        logger.info(result.body)
        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(10);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.totalPage).toBe(2);
        expect(result.body.paging.totalItems).toBe(15);
    });

    it('should can search page 2', async () => {
        const result = await supertest(web)
            .get('/api/kos')
            .query({ page: 2 })
            .set('Authorization', 'test')
        logger.info(result.body)
        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(5);
        expect(result.body.paging.page).toBe(2);
        expect(result.body.paging.totalPage).toBe(2);
        expect(result.body.paging.totalItems).toBe(15);
    });

    it('should can search nama kos', async () => {
        const result = await supertest(web)
            .get('/api/kos')
            .query({ nama_kos: "HR kos 1" })
            .set('Authorization', 'test')
        logger.info(result.body)
        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(6);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.totalPage).toBe(1);
        expect(result.body.paging.totalItems).toBe(6);
    });

    it('should can search alamat kos', async () => {
        const result = await supertest(web)
            .get('/api/kos')
            .query({ alamat_kos: "Jl.HR 1" })
            .set('Authorization', 'test')
        logger.info(result.body)
        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(6);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.totalPage).toBe(1);
        expect(result.body.paging.totalItems).toBe(6);
    });

    it('should can search pemilik kos', async () => {
        const result = await supertest(web)
            .get('/api/kos')
            .query({ pemilik_kos: "Bapak saya 1" })
            .set('Authorization', 'test')
        logger.info(result.body)
        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(6);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.totalPage).toBe(1);
        expect(result.body.paging.totalItems).toBe(6);
    });
})



