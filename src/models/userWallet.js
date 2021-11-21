import mongoose from "mongoose";
import {StockSchema} from './stock.js'

export const UserWalletSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  wallet: [StockSchema],

});

export default mongoose.model("userWallet", UserWalletSchema);