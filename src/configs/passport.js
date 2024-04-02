import passport from "passport";
import session from "express-session";

import {Strategy as LocalStratery} from "passport-local";
import {Strategy as JwtStratery} from "passport-jwt";

import Account from "../models/auth.model.js";
import {validatePassword} from "../models/auth.model.js";

const localOptions = {
    usernameField: "username",
    passwordField: "password",
    passReqToCallback: true,
};

const jwtOptions = {
    jwtFromRequest: (req) => req.cookies.jwt,
    secretOrKey: process.env.JWT_ACCESS_TOKEN,
};

const localStratery = new LocalStratery(localOptions, (req, username, password, done) => {
    Account.findOne({username})
        .then(async (account) => {
            if (!account) {
                return done(null, false, {
                    message: "Username not exist",
                    cause: "incorrect"
                });
            }

            await validatePassword(account, password)
                .then((isValid) => {
                    if (!isValid) {
                        return done(null, false, {message: "Incorrect password.", cause: "incorrect"});
                    }

                    if (!account.isActive && !account.isLocked) {
                        return done(null, false, {
                            status: "error",
                            cause: "inactive",
                            message: "If you're new here, please check your email to activate your account." +
                                " In case, you didn't receive any email or activation link has expired, contact admin to resend activation link",
                            account: account.token
                        });
                    } else if (account.isActive && !account.isLocked) {
                        return done(null, false, {
                            status: "error",
                            cause: "available",
                            message: "Please check your email to activate your account and Create new password",
                            account: account.token
                        });
                    } else if (!account.isActive && account.isLocked) {
                        return done(null, false, {
                            status: "error",
                            cause: "locked",
                            message: "Your account has been locked, please contact admin to unlock your account",
                            account: account.token
                        });
                    }

                    const returnAccount = {
                        _id: account._id,
                        email: account.email,
                        role: account.role,
                        fullName: account.fullName,
                        avatar: account.avatar,
                        isActive: account.isActive,
                        isLocked: account.isLocked,
                        token: account.token,
                        refreshToken: account.refreshToken,
                    }
                    return done(null, returnAccount, {
                        status: "success",
                        message: "Login success",
                        cause: "success",
                    });
                })
                .catch((err) => done(err));
        })
        .catch((err) => done(err));
});

const jwtStratery = new JwtStratery(jwtOptions, (payload, done) => {
    Account.findById(payload._id)
        .then((account) => {
            if (!account) {
                return done(null, false);
            }
            return done(null, account);
        })
        .catch((err) => done(err, false));
});

const {JWT_ACCESS_TOKEN, JWT_ACCESS_TOKEN_LIFE} = process.env;

const passportConfig = (app) => {
    app.use(
        session({
            secret: JWT_ACCESS_TOKEN,
            resave: false,
            saveUninitialized: false
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        // console.log("deserializeUser: ", id);
        const account = await Account.findOne({_id: id});
        if (!account) {
            return done(null, false);
        }

        done(null, account);

    });

    passport.use(localStratery);
    passport.use(jwtStratery);

    app.use(passport.initialize());
    app.use(passport.session());
};

export default passportConfig;
