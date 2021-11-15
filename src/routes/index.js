import express from "express";

import * as controllers from "../controllers/index.js";

const routes = express.Router();

routes.get("/stock/:ticker", controllers.show);

routes.get("/", (req, res) => res.send("Funcionando"));

export default routes;
