import kosService from "../service/kos_service.js";

const create = async (req, res, next) => {
    try {
        const user = req.user;
        const request = req.body;
        const images = req.files || req.file;
        const result = await kosService.create(user, request, images);
        res.status(201).json({ data: result });
    } catch (e) {
        next(e);
    }
}

const get = async (req, res, next) => {
    try {
        const user = req.user;
        const kosId = req.params.kosId;
        const result = await kosService.get(user, kosId);
        res.status(200).json({ data: result });
    } catch (e) {
        next(e);
    }
}

const update = async (req, res, next) => {
    try {
        const user = req.user;
        const kosId = req.params.kosId;
        const request = req.body;
        const images = req.files;
        request.id = kosId
        const result = await kosService.update(user, request, images);
        res.status(200).json({ data: result });
    } catch (e) {
        next(e);
    }
}

const remove = async (req, res, next) => {
    try {
        const user = req.user;
        const kosId = req.params.kosId;
        await kosService.remove(user, kosId);
        res.status(200).json({ data: "OK" });
    } catch (e) {
        next(e);
    }
}

const search = async (req, res, next) => {
    try {
        const user = req.user;
        const request = {
            nama_kos: req.query.nama_kos,
            pemilik_kos: req.query.pemilik_kos,
            alamat_kos: req.query.alamat_kos,
            page: req.query.page,
            size: req.query.size
        }
        const result = await kosService.search(user, request);
        res.status(200).json({ data: result.data, paging: result.paging });
    } catch (e) {
        next(e);
    }
}

export default { create, get, update, remove, search }