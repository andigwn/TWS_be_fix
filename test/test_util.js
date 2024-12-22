import { prismaClient } from "../src/application/database"
import bcrypt from "bcrypt"

export const removeAllTestUser = async () => {
    await prismaClient.user.deleteMany({
        where: {
            username: 'andi'
        }
    })
}

export const createTestUser = async () => {
    await prismaClient.user.create({
        data: {
            username: 'andi',
            email: 'andi@gmail.com',
            password: await bcrypt.hash('andi123', 10),
            name: 'andi gunawan',
            token: "test"
        }
    })
}

export const getTestUser = async () => {
    return await prismaClient.user.findUnique({
        where: {
            username: 'andi'
        }
    })
}

export const removeAllTestKos = async () => {
    await prismaClient.kos.deleteMany({
        where: {
            username: 'andi'
        }
    })
}

export const createTestKos = async () => {
    await prismaClient.kos.create({
        data: {
            username: 'andi',
            nama_kos: 'HR kos',
            pemilik_kos: 'Bapak saya',
            alamat_kos: 'Jl. HR',
            description: 'kos murah',
            image: 'kos.png'
        }
    })
}

export const createManyTestKos = async () => {
    for (let i = 0; i < 15; i++) {
        await prismaClient.kos.create({
            data: {
                username: 'andi',
                nama_kos: `HR kos ${i}`,
                pemilik_kos: `Bapak saya ${i}`,
                alamat_kos: `Jl.HR ${i}`,
                description: `kos murah ${i}`,
                image: `kos${i}.png`
            }
        })

    }
}

export const getTestKos = async () => {
    return await prismaClient.kos.findFirst({
        where: {
            username: 'andi'
        }
    })
}

export const removeAllTestKamars = async () => {
    await prismaClient.kamar.deleteMany({
        where: {
            kos: {
                username: 'andi'
            }
        }
    })
}

export const createTestKamars = async () => {
    const kos = await getTestKos();
    await prismaClient.kamar.create({
        data: {
            kos_id: kos.id,
            nomor_kamar: 'Kamar 1',
            harga: 100000,
            fasilitas: 'AC, TV, Kulkas',
            image: 'kamar.png'
        }
    })
}

export const getTestKamars = async () => {
    return await prismaClient.kamar.findFirst({
        where: {
            kos: {
                username: 'andi'
            }
        }
    })
}