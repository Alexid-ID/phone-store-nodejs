import {default as authRoutes} from "#root/routes/api/api.auth.route.js";
import {default as accountRoutes} from "#root/routes/api/api.account.route.js";
import {default as productRoutes} from "#root/routes/api/api.product.route.js";
import {default as categoryRoutes} from "#root/routes/api/api.category.route.js";
import {default as homeRoutes} from "#root/routes/home.route.js";
import {default as invoiceRoutes} from "#root/routes/api/api.invoice.route.js";
import {default as cartRoutes} from "#root/routes/api/api.cart.route.js";
import {default as customerRoutes} from "#root/routes/api/api.customer.route.js";
import {default as adminRoutes} from "#root/routes/admin.route.js";
import {default as statisticRoutes} from "#root/routes/api/api.statistic.route.js";
import {requireRole} from "#root/middlewares/authjwt.middleware.js";
import {default as employeeRoutes} from "#root/routes/employee.route.js";
import {Roles} from "#root/constants/role.js";

export default (app) => {
    // API
    app.use("/api/auth", authRoutes);
    app.use("/api/account", accountRoutes);
    app.use("/api/admin", adminRoutes);
    app.use("/api/product", productRoutes);
    app.use("/api/category", categoryRoutes);
    app.use("/api/invoice", invoiceRoutes);
    app.use("/api/cart", cartRoutes);
    app.use("/api/customer", customerRoutes);
    app.use("/api/statistic", statisticRoutes);

    app.use("/auth", homeRoutes);
    app.use("/test", (req, res) => {
        return res.json({user: req.user, session: req.session, isAuthenticated: req.isAuthenticated()});
    });

    app.use("/", (req, res, next) => {
        if (!req.isAuthenticated()) {
            return res.redirect("/auth/login");
        }
        console.log("req.user: ", req.user);
        next();
    })

    // EMPLOYEE UI
    app.use("/employee", requireRole([Roles.EMPLOYEE]), employeeRoutes);

    // ADMIN UI
    app.use("/admin", requireRole([Roles.ADMIN]), adminRoutes);

    app.use((req, res, next) => res.status(404).render("layouts/error/404", {
        title: "Error 404",
        user: req.user
    }));

    app.use((err, req, res, next) => {
        console.log(err);
        res.status(500).render("layouts/error/500", {
            title: "Error 500",
            user: req.user
        });
    });
};
