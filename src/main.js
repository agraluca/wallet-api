import express from "express";
import cors from "cors";
import axios from "axios";
import https from "https";
import Path from "path";
import Fs from "fs";

import AdmZip from "adm-zip";

const app = express();

const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

const __dirname = Path.resolve();

async function run(url) {
  const archiveName = url;
  const fileName = archiveName.split("=")[1];
  const path = Path.resolve(__dirname, "src", "files");

  const pathFile = "/InstDados/SerHist/" + fileName;
  const httpsAgent = new https.Agent({ rejectUnauthorized: false });
  axios.defaults.httpsAgent = httpsAgent;

  axios
    .get(`https://bvmf.bmfbovespa.com.br${pathFile}`, {
      headers: {
        "Content-Type": "text/plain;charset=UTF-8",
        "accept-encoding": "gzip, deflate, br",
      },
      responseType: "arraybuffer",
    })
    .then((res) => {
      const zip = new AdmZip(res.data);
      var zipEntries = zip.getEntries();

      // for (var i = 0; i < zipEntries.length; i++) {
      //   console.log("ahgeauEIUHOEHIJLSAHN", zip.readAsText(zipEntries[i]));
      // }
      zip.extractAllTo(path, true);

      //console.log(zipEntries);
      //res.data.pipe(writer);
    });
  console.log(`https://bvmf.bmfbovespa.com.br${pathFile}`);

  return `${path}/${fileName}`.replace(".ZIP", ".TXT");
}
const ata = await run(
  "https://bvmf.bmfbovespa.com.br/pt-br/cotacoes-historicas/FormConsultaValida.asp?arq=COTAHIST_D09112021.ZIP"
);
// console.log(ata);
// Fs.readFile(ata, "utf-8", (err, data) => {
//   //fs.readFileSync('file.txt').toString().split("\n");
//   console.log("data", data.split(" ")[1]);
// });

const data = Fs.readFileSync(ata).toString().split("\n");
data.pop();
data.pop();
data.shift();

const convertedData = data[70].split(" ").filter((line) => line !== "");
console.log("full", convertedData);
//const tickerName = convertedData[0].replace(/[0-9]/g, "");
const tickerName = convertedData[0].map((item) => console.log(item));

console.log("tickerName", tickerName);

app.get("/", (req, res) => res.send("Funcionando"));

app.listen(port, () => console.log("Funcionando"));
