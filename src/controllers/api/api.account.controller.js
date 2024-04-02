import AccountService from "#root/services/account.service.js";
import paginate from "#root/utils/paginate.js";

class ApiAccountController {
    async getAll(req, res) {
        try {
            const accounts = await AccountService.getAll();
            return res.status(200).json(accounts);
        } catch (e) {
            return res.status(500).json(e.message);
        }
    }

    async getById(req, res) {
        return AccountService.getById(req.params.id)
            .then((data) => res.json(data))
            .catch((err) => res.json(err));
    }

    async update(req, res) {
        return AccountService.update(req.params.id, req.body)
            .then((data) => res.json(data))
            .catch((err) => res.json(err));
    }

    async changeAva(req, res) {
        return AccountService.changeAva(req.params.id, req.file)
            .then((data) => res.json(data))
            .catch((err) => res.json(err));
    }

    async deleteOne(req, res) {
        return AccountService.deleteOne(req.params.id)
            .then((data) => res.json(data))
            .catch((err) => res.json(err));
    }

    async deleteMany(req, res) {
        return AccountService.deleteAll(req.body)
            .then((data) => res.json(data))
            .catch((err) => res.json(err));
    }

    async setBlock(req, res) {
        return AccountService.setBlock(req.params.id)
            .then((data) => res.json(data))
            .catch((err) => res.json(err));
    }
}

export default new ApiAccountController();
