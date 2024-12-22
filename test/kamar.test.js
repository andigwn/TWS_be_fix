import supertest from "supertest";
import { createTestKamars, createTestKos, createTestUser, getTestKamars, getTestKos, removeAllTestKamars, removeAllTestKos, removeAllTestUser } from "./test_util";
import { web } from "../src/application/web";
import { logger } from "../src/application/logging";

describe('POST /api/kos/:kosId/kamars', () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestKos();
    })
    afterEach(async () => {
        await removeAllTestKamars();
        await removeAllTestKos();
        await removeAllTestUser();
    });

    it('should can create new kamars', async () => {
        const tesKos = await getTestKos();
        const result = await supertest(web)
            .post('/api/kos/' + tesKos.id + '/kamars')
            .set('Authorization', 'test')
            .send({
                nomor_kamar: 'Kamar 1',
                harga: 100000,
                fasilitas: 'AC, TV, Kulkas',
                image: 'kamar.png'
            })
        logger.info(result.body)
        expect(result.status).toBe(201)
        expect(result.body.data.id).toBeDefined();
        expect(result.body.data.nomor_kamar).toBe('Kamar 1');
        expect(result.body.data.harga).toBe(100000);
        expect(result.body.data.fasilitas).toBe('AC, TV, Kulkas');
        expect(result.body.data.image).toBe('kamar.png');
    });

    it('should reject if kos not found', async () => {
        const tesKos = await getTestKos();
        const result = await supertest(web)
            .post('/api/kos/' + (tesKos.id + 1) + '/kamars')
            .set('Authorization', 'test')
            .send({
                nomor_kamar: 'Kamar 1',
                harga: 100000,
                fasilitas: 'AC, TV, Kulkas',
                image: 'kamar.png'
            })
        logger.info(result.body)
        expect(result.status).toBe(404)
        expect(result.body.errors).toBeDefined();
    });

    it('should reject if request invalid', async () => {
        const tesKos = await getTestKos();
        const result = await supertest(web)
            .post('/api/kos/' + tesKos.id + '/kamars')
            .set('Authorization', 'test')
            .send({
                nomor_kamar: '',
                harga: 100000,
                fasilitas: 'AC, TV, Kulkas',
                image: 'kamar.png'
            })
        logger.info(result.body)
        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });
})

describe('GET /api/kos/:kosId/kamars/:kamarId', () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestKos();
        await createTestKamars();
    })
    afterEach(async () => {
        await removeAllTestKamars();
        await removeAllTestKos();
        await removeAllTestUser();
    });

    it('should can get kamar', async () => {
        const tesKos = await getTestKos();
        const tesKamar = await getTestKamars();
        const result = await supertest(web)
            .get('/api/kos/' + tesKos.id + '/kamars/' + tesKamar.id)
            .set('Authorization', 'test')
        logger.info(result.body)
        expect(result.status).toBe(200)
        expect(result.body.data.id).toBe(tesKamar.id);
        expect(result.body.data.nomor_kamar).toBe(tesKamar.nomor_kamar);
        expect(result.body.data.harga).toBe(tesKamar.harga);
        expect(result.body.data.fasilitas).toBe(tesKamar.fasilitas);
        expect(result.body.data.image).toBe(tesKamar.image);
    });

    it('should reject if kamar not found', async () => {
        const tesKos = await getTestKos();
        const tesKamar = await getTestKamars();
        const result = await supertest(web)
            .get('/api/kos/' + tesKos.id + '/kamars/' + (tesKamar.id + 1))
            .set('Authorization', 'test')
        logger.info(result.body)
        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject if kos not found', async () => {
        const tesKos = await getTestKos();
        const tesKamar = await getTestKamars();
        const result = await supertest(web)
            .get('/api/kos/' + (tesKos.id + 1) + '/kamars/' + tesKamar.id)
            .set('Authorization', 'test')
        logger.info(result.body)
        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined();
    });
});

describe('PUT /api/kos/:kosId/kamars/:kamarId', () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestKos();
        await createTestKamars();
    })
    afterEach(async () => {
        await removeAllTestKamars();
        await removeAllTestKos();
        await removeAllTestUser();
    });

    it('should can update kamar', async () => {
        const tesKos = await getTestKos();
        const tesKamar = await getTestKamars();
        const result = await supertest(web)
            .put('/api/kos/' + tesKos.id + '/kamars/' + tesKamar.id)
            .set('Authorization', 'test')
            .send({
                nomor_kamar: 'Kamar 2',
                harga: 200000,
                fasilitas: 'AC, TV, Kulkas, WC',
                image: 'kamar2.png'
            })
        logger.info(result.body)
        expect(result.status).toBe(201)
        expect(result.body.data.id).toBe(tesKamar.id);
        expect(result.body.data.nomor_kamar).toBe('Kamar 2');
        expect(result.body.data.harga).toBe(200000);
        expect(result.body.data.fasilitas).toBe('AC, TV, Kulkas, WC');
        expect(result.body.data.image).toBe('kamar2.png');
    });

    it('should reject if request kamar invalid', async () => {
        const tesKos = await getTestKos();
        const tesKamar = await getTestKamars();
        const result = await supertest(web)
            .put('/api/kos/' + tesKos.id + '/kamars/' + tesKamar.id)
            .set('Authorization', 'test')
            .send({
                nomor_kamar: '',
                harga: 200000,
                fasilitas: 'AC, TV, Kulkas, WC',
                image: 'kamar2.png'
            })
        logger.info(result.body)
        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject if kamar not found', async () => {
        const tesKos = await getTestKos();
        const tesKamar = await getTestKamars();
        const result = await supertest(web)
            .put('/api/kos/' + tesKos.id + '/kamars/' + (tesKamar.id + 1))
            .set('Authorization', 'test')
            .send({
                nomor_kamar: 'Kamar 2',
                harga: 200000,
                fasilitas: 'AC, TV, Kulkas, WC',
                image: 'kamar2.png'
            })
        logger.info(result.body)
        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject if kos not found', async () => {
        const tesKos = await getTestKos();
        const tesKamar = await getTestKamars();
        const result = await supertest(web)
            .put('/api/kos/' + (tesKos.id + 1) + '/kamars/' + tesKamar.id)
            .set('Authorization', 'test')
            .send({
                nomor_kamar: 'Kamar 2',
                harga: 200000,
                fasilitas: 'AC, TV, Kulkas, WC',
                image: 'kamar2.png'
            })
        logger.info(result.body)
        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined();
    });
});

describe('DELETE /api/kos/:kosId/kamars/:kamarId', () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestKos();
        await createTestKamars();
    })
    afterEach(async () => {
        await removeAllTestKamars();
        await removeAllTestKos();
        await removeAllTestUser();
    });

    it('should can delete kamar', async () => {
        const tesKos = await getTestKos();
        let tesKamar = await getTestKamars();
        const result = await supertest(web)
            .delete('/api/kos/' + tesKos.id + '/kamars/' + tesKamar.id)
            .set('Authorization', 'test')
        logger.info(result.body)
        expect(result.status).toBe(200)
        expect(result.body.data).toBe("OK")

        tesKamar = await getTestKamars();
        expect(tesKamar).toBeNull();

    });

    it('should reject if kamar not found', async () => {
        const tesKos = await getTestKos();
        let tesKamar = await getTestKamars();
        const result = await supertest(web)
            .delete('/api/kos/' + tesKos.id + '/kamars/' + (tesKamar.id + 1))
            .set('Authorization', 'test')
        logger.info(result.body)
        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined();

    });
})

describe('GET /api/kos/:kosId/kamars', () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestKos();
        await createTestKamars();
    })
    afterEach(async () => {
        await removeAllTestKamars();
        await removeAllTestKos();
        await removeAllTestUser();
    });

    it('should can list kamars', async () => {
        const tesKos = await getTestKos();
        const result = await supertest(web)
            .get('/api/kos/' + tesKos.id + '/kamars')
            .set('Authorization', 'test')
        logger.info(result.body)
        expect(result.status).toBe(200)
        expect(result.body.data.length).toBe(1);

    });

    it('should reject if kos not found', async () => {
        const tesKos = await getTestKos();
        const result = await supertest(web)
            .get('/api/kos/' + (tesKos.id + 1) + '/kamars')
            .set('Authorization', 'test')
        logger.info(result.body)
        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined();

    });
})


