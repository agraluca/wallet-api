import express from "express";
import cors from "cors";
import env from "dotenv";

import routes from "./routes/index.js";
import filesController from "./controllers/Files.js";
import { resetAtMidnight } from "./utils/index.js";

import db from "./config/db.js";
const app = express();
env.config();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

db.connect();

resetAtMidnight(filesController.runApp);

app.use(routes);
app.listen(port, () => {
  console.log("Servidor iniciado!");
});
