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
    return res
      .status(200)
      .json({ msg: "Carteira carregada com sucesso", userWallet });
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

  console.log({
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
    return res.status(422).json({ msg: errors });
  }

  const user = await UserWalletModel.findOne({ id: data.id });
  console.log("user", user);

  try {
    if (!user) {
      console.log("entrou no if");
      const newWallet = new UserWalletModel({
        id: data.id,
        wallet: [
          {
            stock,
            type,
            companyName,
            idealPorcentage,
            currentPorcentage,
            price,
            stockAmount,
            shouldBuyAmount,
            status,
          },
        ],
      });
      await newWallet.save();
      return res.status(200).json({ msg: "Ativo adicionado com sucesso!" });
    }

    if (
      user.wallet.find(
        (ticker) => ticker.stock.toUpperCase() === stock.toUpperCase()
      )
    ) {
      return res
        .status(422)
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
    return res.status(422).json({ msg: errors });
  }
  const data = getToken(req);
  const { wallet } = req.body;

  const errorsOnWallet = validateParamsArray(wallet, walletSchema);

  if (errorsOnWallet) {
    return res.status(422).json({ msg: errorsOnWallet });
  }

  try {
    await UserWalletModel.updateOne({ id: data.id }, { wallet });
    return res.status(200).json({ msg: "Carteira atualizda com sucesso!" });
  } catch (error) {
    return res.status(500).json({ msg: error });
  }
}

export async function removeStockFromWallet(req, res) {
  const { _id } = req.body;
  const data = getToken(req);
  const user = await UserWalletModel.findOne({ id: data.id });
  const wallet = user.wallet.filter((item) => item.id !== _id);
  try {
    await UserWalletModel.updateOne({ id: data.id }, { wallet });
    return res.status(200).json({
      msg: "Ativo removido com sucesso!",
    });
  } catch (error) {
    return res.status(500).json({ msg: error });
  }
}
