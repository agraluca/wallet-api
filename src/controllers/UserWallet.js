import UserWalletModel from "../models/UserWallet.js";

import {
  getToken,
  validateParams,
  validateParamsArray,
} from "../utils/index.js";

export async function getUserWallet(req, res) {
  const data = getToken(req);
  try {
    const userWallet = await UserWalletModel.findOne({ id: data.id }, "-_id");

    return res.status(200).json({
      msg: "Carteira carregada com sucesso",
      userWallet: {
        id: userWallet.id,
        wallet: userWallet.wallet,
        walletFixedIncome: userWallet.walletFixedIncome,
      },
    });
  } catch (error) {
    return res.status(500).json({ msg: error });
  }
}

export async function addStockToWallet(req, res) {
  const data = getToken(req);

  const {
    stock,
    type,
    companyName,
    idealPorcentage,
    currentPorcentage,
    price,
    stockAmount,
    shouldBuyAmount,
    status,
  } = req.body;

  const paramsSchema = {
    stock: "",
    type: "",
    idealPorcentage: "",
    currentPorcentage: "",
    price: "",
    stockAmount: "",
    shouldBuyAmount: "",
    status: "",
  };

  const errors = validateParams(req.body, paramsSchema);

  if (errors) {
    return res.status(400).json({ msg: errors });
  }

  const user = await UserWalletModel.findOne({ id: data.id });

  try {
    if (
      user.wallet.find(
        (ticker) => ticker.stock.toUpperCase() === stock.toUpperCase()
      )
    ) {
      return res
        .status(409)
        .json({ msg: "Você já possui esse ativo na sua carteira" });
    }

    user.wallet.push({
      stock,
      type,
      companyName,
      idealPorcentage,
      currentPorcentage,
      price,
      stockAmount,
      shouldBuyAmount,
      status,
    });

    await UserWalletModel.updateOne({ id: data.id }, { wallet: user.wallet });

    return res.status(200).json({ msg: "Ativo adicionado com sucesso!" });
  } catch (error) {
    return res.status(500).json({ msg: error });
  }
}

export async function updateWallet(req, res) {
  const paramsSchema = { wallet: [] };
  const walletSchema = [
    "stock",
    "type",
    "idealPorcentage",
    "currentPorcentage",
    "price",
    "stockAmount",
    "shouldBuyAmount",
    "status",
  ];
  const errors = validateParams(req.body, paramsSchema);
  if (errors) {
    return res.status(400).json({ msg: errors });
  }
  const data = getToken(req);
  const { wallet } = req.body;

  const errorsOnWallet = validateParamsArray(wallet, walletSchema);

  if (errorsOnWallet) {
    return res.status(400).json({ msg: errorsOnWallet });
  }

  try {
    await UserWalletModel.updateOne({ id: data.id }, { wallet });
    return res.status(200).json({ msg: "Carteira atualizda com sucesso!" });
  } catch (error) {
    return res.status(500).json({ msg: error });
  }
}

export async function removeStockFromWallet(req, res) {
  const { id } = req.params;

  const data = getToken(req);
  const user = await UserWalletModel.findOne({ id: data.id });
  const wallet = user?.wallet?.filter((item) => item._id.toString() !== id);

  try {
    await UserWalletModel.updateOne({ id: data.id }, { wallet });
    return res.status(200).json({
      msg: "Ativo removido com sucesso!",
    });
  } catch (error) {
    return res.status(500).json({ msg: error });
  }
}

export async function addFixedIncomeToWallet(req, res) {
  const data = getToken(req);

  const {
    name,
    idealPorcentage,
    currentPorcentage,
    totalPrice,
    shouldBuyPrice,
    status,
  } = req.body;

  const paramsSchema = {
    name: "",
    idealPorcentage: "",
    currentPorcentage: "",
    totalPrice: "",
    shouldBuyPrice: "",
    status: "",
  };

  const errors = validateParams(req.body, paramsSchema);

  if (errors) {
    return res.status(422).json({ msg: errors });
  }

  const user = await UserWalletModel.findOne({ id: data.id });

  try {
    if (
      user.walletFixedIncome.find(
        (item) => item.name.toUpperCase() === name.toUpperCase()
      )
    ) {
      return res
        .status(422)
        .json({ msg: "Você já possui esse ativo na sua carteira" });
    }

    user.walletFixedIncome.push({
      name,
      idealPorcentage,
      currentPorcentage,
      totalPrice,
      shouldBuyPrice,
      status,
    });

    await UserWalletModel.updateOne(
      { id: data.id },
      { walletFixedIncome: user.walletFixedIncome }
    );

    return res.status(200).json({ msg: "Renda fixa adicionada com sucesso!" });
  } catch (error) {
    return res.status(500).json({ msg: error });
  }
}

export async function updateFixedIncomeToWallet(req, res) {
  const paramsSchema = { walletFixedIncome: [] };
  const walletSchema = [
    "name",
    "idealPorcentage",
    "currentPorcentage",
    "totalPrice",
    "shouldBuyPrice",
    "status",
  ];
  const errors = validateParams(req.body, paramsSchema);
  if (errors) {
    return res.status(422).json({ msg: errors });
  }
  const data = getToken(req);
  const { walletFixedIncome } = req.body;

  const errorsOnWallet = validateParamsArray(walletFixedIncome, walletSchema);

  if (errorsOnWallet) {
    return res.status(422).json({ msg: errorsOnWallet });
  }

  try {
    await UserWalletModel.updateOne({ id: data.id }, { walletFixedIncome });
    return res.status(200).json({ msg: "Carteira atualizda com sucesso!" });
  } catch (error) {
    return res.status(500).json({ msg: error });
  }
}

export async function removeFixedIncomeFromWallet(req, res) {
  const { id } = req.params;

  const data = getToken(req);
  const user = await UserWalletModel.findOne({ id: data.id });
  const walletFixedIncome = user?.walletFixedIncome?.filter(
    (item) => item._id.toString() !== id
  );

  try {
    await UserWalletModel.updateOne({ id: data.id }, { walletFixedIncome });
    return res.status(200).json({
      msg: "Ativo removido com sucesso!",
    });
  } catch (error) {
    return res.status(500).json({ msg: error });
  }
}
