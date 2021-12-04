import mongoose from "mongoose";

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

const WalletFixedIncomeModel = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  idealPorcentage: {
    type: Number,
    required: true,
  },
  currentPorcentage: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  shouldBuyPrice: {
    type: Number,
    required: true,
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
  walletFixedIncome: [WalletFixedIncomeModel],
});

export default mongoose.model("UserWallet", UserWalletSchema);
