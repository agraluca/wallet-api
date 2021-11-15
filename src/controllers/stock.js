import StockModel from "../models/stock.js";

function index(req, res) {
  StockModel.find((err, data) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.status(200).json(data);
    }
  });
}

function show(req, res) {
  const tickerName = req.params.ticker.toUpperCase();
  StockModel.findOne({ tickerName }, (err, data) => {
    if (err) {
      res.status(500).json(err);
    } else {
      data
        ? res.status(200).json(data)
        : res.status(404).json({ error: "Not Found a Stock with this name" });
    }
  });
}

export const Stock = {
  index,
  show,
};
