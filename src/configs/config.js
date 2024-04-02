import express from "express";
import morgan from "morgan";
import ejs from "ejs";
import {fileURLToPath} from "url";
import * as path from "path";
import cookieParser from "cookie-parser";
import session from "express-session";
import flash from "express-flash";
// import flash from "connect-flash";1

const config = async (app) => {
    app.engine("ejs", ejs.renderFile);
    app.set("view engine", "ejs");

    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use(cookieParser());

    // app.use(flash())
    const __filename = fileURLToPath(import.meta.url);
    // const __filename = path.resolve()
    const __dirname = path.dirname(__filename).slice(0, -7);
    console.log(__dirname);
    app.use(express.static(path.join(__dirname, "public")));
    app.set("views", path.join(__dirname, "views"));

    app.use("/css", express.static("./node_modules/bootstrap/dist/css"));
    app.use("/js", express.static("./node_modules/bootstrap/dist/js"));

    // app.use('/favicon.ico', express.static('./src/public/favicon.ico'));
    app.use(morgan("combined"));

    // app.use(
    // 	session({
    // 		secret: "secret",
    // 		resave: true, // save session after each request
    // 		saveUninitialized: false, // saved new sessions
    // 	})
    // );

    app.use(flash());
};

export default config;
