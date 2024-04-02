import Account from "#root/models/auth.model.js";
import transporter from "../../configs/email.js";
import AuthService from "../../services/auth.service.js";
import {generateActiveToken, generateRefreshToken} from "../../middlewares/authjwt.middleware.js";

class ApiAuthControllers {
    async login(req, res, next) {
        // const { email, password } = req.body;
        return AuthService.login(req, res, next)
            .then((data) => res.json(data))
            .catch((err) => res.json(err));
    }

    async register(req, res) {
        const {fullname, email, role} = req.body;
        const account = await AuthService.register(fullname, email, role)
            .then((data) => {
                if (data.status === 400) {
                    return res.status(400).json(data);
                } else {
                    return res.status(200).json({
                        status: 200,
                        message: "Register success",
                        data: data,
                    });
                }
            })
            .catch((err) => {
                return res.status(500).json(err);
            });
    }

    async setActive(req, res) {
        const {email, token} = req.query;
        return AuthService.setActive(email, token)
            .then((data) => res.redirect("http://localhost:3000/auth/login"))
            .catch((err) => res.status(400).json(err));
    }

    async logout(req, res) {
        console.log("logout - req.session.accounts: ", req.session.accounts);
        const id = req.params.id;
        const account = await Account.findById(id);
        if (!account) {
            return res.status(400).json({errors: "Account not found"});
        }
        // if (!req.session.accounts) {
        //     console.log("test logout: ", req.session.accounts);
        //     return (req.session.accounts = []);
        // }
        // req.session.accounts = req.session.accounts.filter((account) => account._id !== id);
        // req.session.save();

        req.logout(function (err) {
            if (err) {
                console.log(err);
                return res.status(500).json({errors: "Server errors"});
            }
        });

        if (!req.isAuthenticated()) {
            console.log("logout success");
        } else {
            console.log("logout fail");
        }
        res.clearCookie("refreshToken");
        res.clearCookie("role");
        return res.status(200).json({message: "Logout success"});
    }

    async resendMail(req, res) {
        try {
            const {email} = req.body;
            const account = await Account.findOne({email: email});
            if (!account) {
                return res.status(400).json({errors: "Account not found"});
            }
            if (!account.isActive) {
                const token = await generateActiveToken(account, "1m");
                const mailOptions = {
                    from: "hellobao2911@gmail.com",
                    to: email,
                    template: "email",
                    subject: "Resend link to active",
                    html: `<p>Click the following link to confirm your registration: <a href="http://localhost:3000/api/auth/active?email=${email}&token=${token}">Link</a></p>`,
                };
                try {
                    await transporter.sendMail(mailOptions);
                    console.log("Send mail success");
                } catch (e) {
                    console.log(e);
                }
                const refreshToken = await generateRefreshToken(account);
                // store token to account;
                account.token = token;
                account.refreshToken = refreshToken;
                await account.save();
                return res.status(200).json({message: "Resend mail success"});
            } else {
                return res.status(400).json({errors: "Account is active"});
            }
        } catch (e) {
            console.log(e);
            return res.status(500).json({errors: "Server errors"});
        }
    }

    async resetPassword(req, res) {
        const id = req.params.id;
        const {newPassword, confirmPassword} = req.body;
        // console.log("test reset password: ", id, newPassword, confirmPassword)
        const account = await AuthService.resetPassword(id, newPassword, confirmPassword);
        // console.log("--------------------", account);
        if (account.status) {
            return res.status(400).json({errors: "Reset password fail", status: "error"});
        }
        return res.status(200).json({message: "Reset password success", status: "success"});
    }
}

export default new ApiAuthControllers();
