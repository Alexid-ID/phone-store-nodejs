import express from "express";

const router = express.Router();
import Account from "#root/models/auth.model.js";

// Page
router.get("/login", (req, res) => {
    // const { email, locked , active } = req.query;
    res.render("layouts/auth/login", {title: "Login "});
});
router.get("/register", (req, res) => res.render("layouts/register"));

router.get("/resetPass/:token", async (req, res) => {
    const token = req.params.token;
    const account = await Account.findOne({token});
    if (!account) {
        return res.status(400).json({errors: "Account not found"});
    }
    res.render("layouts/auth/resetPassword", {title: "Reset Password", account: account._id});
});

router.get("/resend", (req, res) => {
    res.render("layouts/auth/resend", {title: "Resend Mail"});
});

export default router;