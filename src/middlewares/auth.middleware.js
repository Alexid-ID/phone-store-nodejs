import passport from "passport";
import Account from "../models/auth.model.js";
const authenticate = (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            return res.status(401).json({
                message: "Unauthorized",
                error: info.message
            });
        }
        req.user = user;
        next();
    })(req, res, next);
};
const checkDuplicateEmail = (req, res, next) => {
    Account.findOne({
        email: req.body.email
    }).exec((err, account) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (account) {
            res.status(400).send({ message: "Failed! Email is already in use!" });
            return;
        }
        next();
    });
}
export { authenticate, checkDuplicateEmail };