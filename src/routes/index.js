import express from "express";
import mongoose from "mongoose";
import StockInfo from "../model/contents.js";

const stockInfo = mongoose.model("stockInfo");

const routes = express.Router();

routes.get("/stock", (req, res) => {
  stockInfo.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

routes.get("/", (req, res) => res.send("Funcionando"));

export default routes;
