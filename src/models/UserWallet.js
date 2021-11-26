import mongoose from "mongoose";
import { StockObjectSchema } from "./Stock.js";

const WalletStockModel = new mongoose.Schema({
  ...StockObjectSchema,
  qtd: { type: Number },
});

export const UserWalletSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },

  wallet: [WalletStockModel],
});

export default mongoose.model("UserWallet", UserWalletSchema);
