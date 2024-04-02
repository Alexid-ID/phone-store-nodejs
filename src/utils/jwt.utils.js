import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

const { JWT_ACCESS_TOKEN, JWT_ACCESS_TOKEN_LIFE } = process.env

const generateToken = (user) => {
    const { _id, email, role } = user;
    const payload = {
        _id,
        email,
        role
    }

    const token = jwt.sign(payload, JWT_ACCESS_TOKEN, { expiresIn: JWT_ACCESS_TOKEN_LIFE });
    return token;
}

const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, JWT_ACCESS_TOKEN, (err, payload) => {
            if (err) return reject(err);
            resolve(payload);
        })
    })
}