import mongoose from "mongoose";
import { StockObjectSchema } from "./Stock.js";

const WalletStockModel = new mongoose.Schema({
  stock: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  idealPorcentage: {
    type: Number,
    required: true,
  },
  currentPorcentage: {
    type: Number,
    required: true,
    max: 100,
  },
  stockAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  shouldBuyAmount: {
    type: Number,
    required: false,
  },
  status: {
    type: String,
    required: true,
  },
});

export const UserWalletSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },

  wallet: [WalletStockModel],
});

export default mongoose.model("UserWallet", UserWalletSchema);
