import mongoose from "mongoose";
import StockInfo from "../model/contents.js";

const stockInfo = mongoose.model("stockInfo");

export function show(req, res) {
  const tickerName = req.params.ticker.toUpperCase();
  stockInfo.findOne({ tickerName }, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
}
