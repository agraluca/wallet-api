import mongoose from "mongoose";
import {StockObjectSchema} from './stock.js'

const WalletStockModel = new mongoose.Schema({...StockObjectSchema, qtd: {type: Number}})

export const UserWalletSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  wallet: [WalletStockModel],

});

export default mongoose.model("userWallet", UserWalletSchema);