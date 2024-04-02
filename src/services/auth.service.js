import Account from "../models/auth.model.js";
import bcrypt from "bcrypt";
import transporter from "../configs/email.js";
import {ErrorMessage} from "../errors/message.js";
import {Roles} from "#root/constants/role.js";
import passport from "passport";

const HOST = process.env.HOST;
import {
    generateRefreshToken,
    generateToken,
    generateActiveToken,
    verifyToken,
} from "../middlewares/authjwt.middleware.js";
import mongoose from "mongoose";

class AuthService {
    async register(fullname, email, role) {
        let error = [];
        const username = email.split("@")[0];
        if (!email || !fullname) {
            error.push({message: "Vui lòng nhập đầy đủ thông tin"});
            return ErrorMessage(400, error);
        } else {
            try {
                if (role.toUpperCase() === Roles.ADMIN) {
                    role = Roles.ADMIN;
                } else {
                    role = Roles.EMPLOYEE;
                }
                const account = await Account.findOne({email: email});
                if (account) {
                    error.push({message: "Email đã tồn tại"});
                    return ErrorMessage(400, error);
                }
                const hashedPassword = bcrypt.hashSync(username, bcrypt.genSaltSync(10));

                const payload = {
                    email: email,
                    password: hashedPassword,
                    username: username,
                    fullName: fullname,
                    role: role
                };

                const newAccount = new Account(payload);
                const token = await generateActiveToken(newAccount);
                const mailOptions = {
                    from: "hellobao2911@gmail.com",
                    to: email,
                    template: "email",
                    subject: "Confirm Registration",
                    html: `
                    <div style="width: 100%; height: 100%; background-color: #f5f5f5; padding: 20px 0;">
                        <div style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 10px;">
                            <div style="width: 100%; text-align: center;">
                                <h1 style="font-size: 24px; color: #333; font-weight: 600;">Xác nhận đăng ký</h1>
                            </div>
                            <div style="width: 100%; text-align: center;">
                                <p style="font-size: 16px; color: #333; font-weight: 400;">Chào mừng bạn đến với <span style="font-weight: 600;">EI POS - Phone Store</span></p>
                            </div>
                            <div style="width: 100%; text-align: center;">
                                <p style="font-size: 16px; color: #333; font-weight: 400;">Click vào link bên dưới để xác nhận đăng ký</p>
                            </div>
                            <div style="width: 100%; text-align: center;">
                                <a href="${HOST}/api/auth/active?email=${email}&token=${token}" style="font-size: 16px; color: #fff; font-weight: 400; background-color: #4f5cf0; padding: 10px 20px; border-radius: 5px; text-decoration: none;">Xác nhận</a>
                            </div>
                        </div>
                    </div>
                    `
                };
                try {
                    await transporter.sendMail(mailOptions);
                    console.log("Send mail success");
                } catch (e) {
                    console.log(e);
                }
                const refreshToken = await generateRefreshToken(newAccount);
                // store token to newAccount;
                newAccount.token = token;
                newAccount.refreshToken = refreshToken;

                await newAccount.save();
                return newAccount;
            } catch (e) {
                console.log(e);
            }
        }
    }

    async login(req, res, next) {
        console.log("test login");
        return new Promise((resolve, reject) => {
            passport.authenticate(
                "local",
                {
                    session: false,
                },
                (err, user, info) => {
                    console.log("user: ", user);
                    console.log("info: ", info);
                    console.log("err: ", err);
                    if (err) return next(err);
                    switch (info.cause) {
                        case "locked":
                            req.flash("error", "Tài khoản của bạn đã bị khóa");
                            console.log("locked: ", info.cause);
                            return resolve({
                                status: "error",
                                cause: "locked",
                                message: info.message,
                                account: info.account
                            });
                        case "available":
                            req.flash("error", "Bạn chưa đổi mật khẩu");
                            return resolve({
                                status: "error",
                                cause: "available",
                                message: info.message,
                                account: info.account
                            })
                        case "inactive":
                            req.flash("error", "Tài khoản của bạn chưa được kích hoạt");
                            // return res.redirect("/login");
                            return resolve({
                                status: "error",
                                cause: "inactive",
                                message: info.message,
                                account: info.account
                            });
                        case "incorrect":
                            req.flash("error", "Sai mật khẩu");
                            return resolve({
                                status: "error",
                                cause: "incorrect",
                                message: info.message,
                                account: info.account
                            });
                        default:
                            break;
                    }
                    if (!user) return res.redirect("/login");
                    req.logIn(user, function (err) {
                        if (err) {
                            console.log(err);
                            return next(err);
                        }
                        res.cookie("role", user.role, {maxAge: 1000 * 60 * 60 * 24, httpOnly: true});
                        // req.session.accounts = req.session.accounts || [];
                        // req.session.accounts.push(user);
                        // req.session.currentAccount = user;

                        req.session.save();
                        return resolve({
                            status: "success",
                            cause: "success",
                            message: info.message,
                            account: user
                        });
                    });
                }
            )(req, res, next);
        });
    }

    async setActive(email, token) {
        try {
            const account = await Account.findOne({email: email});
            if (!account) {
                return null;
            } else {
                const tokenDecoded = await verifyToken(token)
                    .then((data) => data)
                    .catch((err) => null);
                if (!tokenDecoded) {
                    return null;
                }
                account.isActive = true;
                await account.save();
                return account;
            }
        } catch (e) {
            console.log(e);
            return ErrorMessage(500, "Server errors", e);
        }
    }

    async resetPassword(id, newPass, confirmPass) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return ErrorMessage(404, "Account not found");
            }

            const account = await Account.findById(id);
            if (!account) {
                return ErrorMessage(400, "Account not found");
            }
            const isMatch = await bcrypt.compare(newPass, account.password);
            if (!isMatch) {
                if (newPass !== confirmPass) {
                    return ErrorMessage(400, "Password not match");
                }
                const hashedPassword = bcrypt.hashSync(newPass, bcrypt.genSaltSync(10));
                account.password = hashedPassword;
                if (account.isLocked === false) {
                    account.isLocked = true;
                }
                await account.save();
                return account;
            } else {
                return ErrorMessage(400, "New password must be different from the old password");
            }
        } catch (e) {
            return ErrorMessage(500, "Server errors", e);
        }
    }
}

export default new AuthService();
