import express from "express";
import initDatabase from "./src/configs/db.js";
import passportConfig from "./src/configs/passport.js";
import initRoutes from "#root/configs/route.config.js";
import config from "./src/configs/config.js";
import loadDatabase from "./init-db.js";

const app = express();
await config(app);
await initDatabase.connect();
passportConfig(app);
initRoutes(app);
// await loadDatabase();
const {PORT} = process.env || 3000;
const HOST = process.env.HOST || "localhost";
app.listen(PORT, () => {
    console.log(`Server is running on ${HOST}`);
});
