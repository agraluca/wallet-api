import User from "../models/User.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function createUser(req, res) {
  const { name, email, password, confirmPassword } = req.body;
  if (!name) {
    return res.status(422).json({ msg: "O nome é obrigatório" });
  }
  if (!email) {
    return res.status(422).json({ msg: "O email é obrigatório" });
  }
  if (!password) {
    return res.status(422).json({ msg: "A senha é obrigatório" });
  }
  if (!confirmPassword) {
    return res
      .status(422)
      .json({ msg: "A confirmação de senha é obrigatória" });
  }
  if (confirmPassword !== password) {
    return res.status(422).json({ msg: "As senhas não conferem" });
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(422).json({ msg: "Esse email ja foi utilizado" });
  }

  const salt = await bcrypt.genSalt(16);
  const passwordHash = await bcrypt.hash(password, salt);

  const user = new User({
    name,
    email,
    password: passwordHash,
  });

  try {
    await user.save();
    res.status(201).json({ msg: "Usuário criado com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Aconteceu um erro no servidor" });
  }
}

export async function sigInUser(req, res) {
  const { email, password } = req.body;
  if (!email) {
    return res.status(422).json({ msg: "O email é obrigatório" });
  }
  if (!password) {
    return res.status(422).json({ msg: "A senha é obrigatória" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ msg: "Usuário não encontrado" });
  }

  const checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword) {
    return res.status(422).json({ msg: "Senha inválida" });
  }

  try {
    const secret = process.env.SECRET;
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      secret,
      { expiresIn: "1d" }
    );

    const refreshToken = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      secret,
      { expiresIn: "25h" }
    );

    res
      .status(200)
      .json({ msg: "Usuário logado com sucesso", token, refreshToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Aconteceu um erro no servidor" });
  }
}

export async function refreshToken(req, res) {
  const { refreshToken } = req.body;
  const secret = process.env.SECRET;
  const data = jwt.verify(refreshToken, secret);

  const user = await User.findById(data.id, "-password");

  if (!user) {
    return res.status(404).json({ msg: "Usuário não encontrado" });
  }

  try {
    const newToken = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      secret,
      { expiresIn: "1d" }
    );

    const newRefreshToken = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      secret,
      { expiresIn: "25h" }
    );

    res.status(200).json({
      msg: "JWT atualizado com sucesso",
      token: newToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Aconteceu um erro no servidor" });
  }
}
