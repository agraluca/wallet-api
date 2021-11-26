import jwt from "jsonwebtoken";

export function resetAtMidnight(fn) {
  let from = new Date();
  let to = new Date(
    from.getFullYear(),
    from.getMonth(),
    from.getDate() + 1,
    0,
    0,
    0
  );
  let msToEnd = to.getTime() - from.getTime();

  setTimeout(() => {
    fn();
    resetAtMidnight();
  }, msToEnd);
}

export function checkToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "Acesso negado" });
  }

  try {
    const secret = process.env.SECRET;
    jwt.verify(token, secret);
    next();
  } catch (err) {
    return res.status(400).json({ msg: "Token inválido" });
  }
}

export function getToken(req) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  const secret = process.env.SECRET;
  const verifiedToken = jwt.verify(token, secret);
  return verifiedToken;
}

export function validateParams(params, objectSchema) {
  const errors = [];

  for (let key in objectSchema) {
    if (!params[key]) {
      errors.push({ msg: `O parâmetro ${key} é obrigatório!` });
    }
  }
  return errors.length > 0 ? errors : null;
}

export function validateParamsArray(params, objectSchema) {
  const errors = [];
  params.forEach((item) =>
    objectSchema.forEach((prop) => {
      if (!item.hasOwnProperty(prop)) {
        errors.push({ msg: `O parâmetro ${prop} é obrigatório!` });
      }
    })
  );
  return errors.length > 0 ? errors : null;
}
