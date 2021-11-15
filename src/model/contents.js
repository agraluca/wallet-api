import mongoose from "mongoose";

const ContentSchema = new mongoose.Schema({
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

export default mongoose.model("stockInfo", ContentSchema);
