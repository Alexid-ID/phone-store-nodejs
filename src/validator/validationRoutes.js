import { validationResult } from "express-validator";

const validation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array()[0].msg);
        return res.status(400).json( errors.array()[0].msg)
    }
    next();
};

export default validation;