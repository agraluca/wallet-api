import express from "express";

import * as controllers from "../controllers/index.js";

const routes = express.Router();

routes.get("/stock", controllers.Stock.index);

routes.get("/stock/:ticker", controllers.Stock.show);

routes.get("/wallet/:userEmail", controllers.UserWallet.index)

routes.post("/wallet", controllers.UserWallet.save)

routes.delete("/wallet/:userEmail", controllers.UserWallet.remove)

routes.post("/wallet/add", controllers.UserWallet.addStockInWallet)

routes.get("/", (req, res) => res.send("Wallet API"));

export default routes;
