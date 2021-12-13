import express from "express";
import cors from "cors";
import env from "dotenv";

import routes from "./src/routes/index.js";
import { runApp } from "./src/controllers/Files.js";
import { resetAtMidnight } from "./src/utils/index.js";

import db from "./src/config/db.js";
const app = express();
env.config();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

db.connect();

resetAtMidnight(runApp);

app.use(routes);
app.listen(port, () => {
  console.log("Servidor iniciado!");
});
