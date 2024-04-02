import Account from "../models/auth.model.js";
import {Roles} from "#root/constants/role.js";
import {ErrorMessage} from "../errors/message.js";
import fs from "fs";

class AccountService {
    async getAll() {
        try {
            //get column : name, email, created_at, is_active, is_locked
            const accounts = await Account.find().select("avatar fullName role email createdAt isActive isLocked");
            return accounts;
        } catch (e) {
            return {message: e.message};
        }
    }

    async getById(id) {
        try {
            const account = await Account.findById(id).select("avatar fullName email role createdAt isActive isLocked");
            return account;
        } catch (e) {
            return {message: e.message};
        }
    }

    async update(id, data) {
        try {
            const account = await Account.findOneAndUpdate({_id: data._id}, {$push: {sales: data.invoices}});
            if (account == null) {
                return null
            } else {
                return account
            }
        } catch (e) {
            console.log(e)
            return ErrorMessage(500, "Server errors", e);
        }
    }

    async changeAva(id, file) {
        try {
            const account = await Account.findById(id);
            if (!account) return ErrorMessage(404, "Account not found");
            if (!file) return ErrorMessage(400, "File not found");

            if (account.avatar !== '/images/user.png') {
                fs.unlinkSync(`src/public${account.avatar}`);
            }

            const image = file.filename;
            const slug = account.username.replace(/ /g, "-");
            const extension = image.split(".").pop();
            const newImage = slug + "." + extension;
            fs.renameSync(file.path, `src/public/uploads/avatars/${newImage}`);

            account.avatar = "/uploads/avatars/" + newImage;
            await account.save();
            return account;
        } catch (e) {
            return ErrorMessage(500, "Server errors", e);
        }
    }

    async deleteOne(id) {
        try {
            const account = await Account.findById(id);
            if (!account) {
                return ErrorMessage(404, "Account not found")
            }
            await account.deleteOne();
            return "Delete account successfully";
        } catch (e) {
            return ErrorMessage(500, "Server errors", e);
        }
    }

    async deleteAll() {
        try {
            await Account.deleteMany();
            return "Delete all accounts successfully";
        } catch (e) {
            return ErrorMessage(500, e.message);
        }
    }

    async setBlock(id) {
        try {
            const account = await Account.findById(id);
            if (!account) {
                return ErrorMessage(404, "Account not found")
            }
            if (account.role === Roles.ADMIN) return ErrorMessage(400, "Can't block admin account");
            // account.isLocked = !account.isLocked;
            account.isActive = !account.isActive;
            await account.save();
            return account;
        } catch (e) {
            return ErrorMessage(500, "Server errors", e);
        }
    }
}

export default new AccountService();
