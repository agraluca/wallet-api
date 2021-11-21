import mongoose from "mongoose";

export const StockSchema = new mongoose.Schema({
  tickerName: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  tickerType: {
    type: String,
    required: true,
  },
  formattedPrice: {
    type: String,
    required: true,
  },
});

export default mongoose.model("stockInfo", StockSchema);
