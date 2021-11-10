import express from "express";
import cors from "cors";
import axios from "axios";
import https from "https";
import Path from "path";
import Fs from "fs";

const app = express();

const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

const __dirname = Path.resolve();

async function run(url) {
  const archiveName = url;
  const fileName = archiveName.split("=")[1];
  const path = Path.resolve(__dirname, "src", "files", fileName);
  const writer = Fs.createWriteStream(path);

  const pathFile = "/InstDados/SerHist/" + fileName;
  const httpsAgent = new https.Agent({ rejectUnauthorized: false });
  axios.defaults.httpsAgent = httpsAgent;
  axios
    .get(`https://bvmf.bmfbovespa.com.br${pathFile}`, {
      headers: {
        "Content-Type": "text/plain;charset=UTF-8",
        "accept-encoding": "gzip, deflate, br",
      },
      responseType: "stream",
    })
    .then((res) => res.data.pipe(writer));
  console.log(`https://bvmf.bmfbovespa.com.br${pathFile}`);
}
run(
  "https://bvmf.bmfbovespa.com.br/pt-br/cotacoes-historicas/FormConsultaValida.asp?arq=COTAHIST_D09112021.ZIP"
);
app.get("/", (req, res) => res.send("Funcionando"));

app.listen(port, () => console.log("Funcionando"));
