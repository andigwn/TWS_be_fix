import kamarService from "../service/kamar_service.js";
const create = async (req, res, next) => {
    try {
        const user = req.user;
        const request = req.body;
        const kosId = req.params.kosId;
        const images = req.files || req.file;

        const result = await kamarService.create(user, kosId, request, images);
        res.status(201).json({ data: result });
    } catch (e) {
        next(e);
    }
}

const get = async (req, res, next) => {
    try {
        const user = req.user;
        const kosId = req.params.kosId;
        const kamarId = req.params.kamarId;
        const result = await kamarService.get(user, kosId, kamarId);
        res.status(200).json({ data: result });
    } catch (e) {
        next(e);
    }
}
const update = async (req, res, next) => {
    try {
        const user = req.user;
        const kosId = req.params.kosId;
        const kamarId = req.params.kamarId;
        const request = req.body;
        const images = req.files;
        request.id = kamarId

        const result = await kamarService.update(user, kosId, request, images);
        res.status(201).json({ data: result });
    } catch (e) {
        next(e);
    }
}

const remove = async (req, res, next) => {
    try {
        const user = req.user;
        const kosId = req.params.kosId;
        const kamarId = req.params.kamarId;

        await kamarService.remove(user, kosId, kamarId);
        res.status(200).json({ data: "OK" });
    } catch (e) {
        next(e);
    }
}

const list = async (req, res, next) => {
    try {
        const user = req.user;
        const kosId = req.params.kosId;
        const result = await kamarService.list(user, kosId);
        res.status(200).json({ data: result });
    } catch (e) {
        next(e);
    }
}

export default { create, get, update, remove, list }; 