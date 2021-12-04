import StockModel from "../models/Stock.js";

function show(req, res) {
  const tickerName = req.params.ticker.toUpperCase();
  StockModel.findOne(
    { tickerName },
    "tickerName companyName tickerType formattedPrice",
    (err, data) => {
      if (err) {
        res.status(500).json(err);
      } else {
        data
          ? res.status(200).json(data)
          : res
              .status(404)
              .json({ error: "Não foi encontrado um ativo com esse nome" });
      }
    }
  );
}

export const Stock = {
  show,
};
