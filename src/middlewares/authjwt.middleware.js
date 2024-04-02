import jwt from "jsonwebtoken";
import Account from "../models/auth.model.js";

const {JWT_ACCESS_TOKEN, JWT_ACCESS_TOKEN_LIFE} = process.env
const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, JWT_ACCESS_TOKEN, (err, decoded) => {
            if (err) return reject(err);
            resolve(decoded);
        });
    })
}
const generateToken = (user) => {
    return new Promise((resolve, reject) => {
        const {_id, email, role} = user;
        const payload = {
            _id,
            email,
            role,
            username: user.username
        }
        jwt.sign(payload, JWT_ACCESS_TOKEN, {expiresIn: JWT_ACCESS_TOKEN_LIFE}, (err, token) => {
            if (err) return reject(err);
            resolve(token);
        })
    })
}
const generateActiveToken = (user, timeout = '1m') => {
    return new Promise((resolve, reject) => {
        const {_id, email, role} = user;
        const payload = {
            _id,
            email,
            role,
            username: user.username
        }
        jwt.sign(payload, JWT_ACCESS_TOKEN, {expiresIn: timeout}, (err, token) => {
            if (err) return reject(err);
            resolve(token);
        })
    })
}
const generateRefreshToken = (user) => {
    return new Promise((resolve, reject) => {
        const {_id, email, role} = user;
        const payload = {
            _id,
            email,
            role,
            username: user.username
        }
        jwt.sign(payload, JWT_ACCESS_TOKEN, {expiresIn: JWT_ACCESS_TOKEN_LIFE}, (err, token) => {
            if (err) return reject(err);
            resolve(token);
        })
    })
}

const requireRole = (roles) => {
    if (!roles) {
        throw new Error("Role is required");
    }

    return async (req, res, next) => {
        if (!Array.isArray(roles)) {
            let role;
            role = [roles];
        }
        console.log(req.cookies)

        const accountRole = req.cookies.role;

        console.log(roles)

        if (!roles.includes(accountRole)) {
            return res.status(404).render('layouts/error/404', {title: "Error 404"});
        }
        next();
    }
}
export {verifyToken, requireRole, generateToken, generateRefreshToken, generateActiveToken};