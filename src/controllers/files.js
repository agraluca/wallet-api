import AdmZip from "adm-zip";
import Path from "path";
import Fs from "fs";

import StockModel from "../models/stock.js";

const __dirname = Path.resolve();

async function getFile(url) {
  const archiveName = url;
  const fileName = archiveName.split("=")[1];
  const path = Path.resolve(__dirname, "src", "files");

  const pathFile = "/InstDados/SerHist/" + fileName;
  const httpsAgent = new https.Agent({ rejectUnauthorized: false });
  axios.defaults.httpsAgent = httpsAgent;

  const response = await axios.get(
    `https://bvmf.bmfbovespa.com.br${pathFile}`,
    {
      headers: {
        "Content-Type": "text/plain;charset=UTF-8",
        "accept-encoding": "gzip, deflate, br",
      },
      responseType: "arraybuffer",
    }
  );

  const zip = new AdmZip(response.data);

  zip.extractAllTo(path, true);

  return `${path}/${fileName}`.replace(".ZIP", ".TXT");
}

async function runApp() {
  const date = new Date();

  const weekDay = date.getDay();

  if (weekDay !== 0 && weekDay !== 1) {
    const yesterday = new Date(date);

    yesterday.setDate(yesterday.getDate() - 1);

    const day =
      yesterday.getDate().toString().length === 1
        ? `0${yesterday.getDate()}`
        : yesterday.getDate();
    const month = yesterday.getMonth() + 1;

    const fullYear = yesterday.getFullYear();
    const formattedDate = `${day}${month}${fullYear}`;
    const archivePath = await getFile(
      `https://bvmf.bmfbovespa.com.br/pt-br/cotacoes-historicas/FormConsultaValida.asp?arq=COTAHIST_D${formattedDate}.ZIP`
    );

    if (archivePath) {
      StockModel.deleteMany({});
      const data = Fs.readFileSync(archivePath).toString().split("\n");
      data.pop();
      data.pop();
      data.shift();

      const stockInfoArray = data.map((item) => {
        const tickerName = item.slice(12, 23).trim();
        const companyName = item.slice(27, 39).trim();
        const tickerType = item.slice(39, 42).trim();
        const stringPrice = item.slice(109, 121);

        const priceNumberList = [...stringPrice].reduce((acc, item) => {
          if (Number(item) !== 0) {
            acc.push(item);
          }

          return acc;
        }, []);
        const index = stringPrice.indexOf(priceNumberList[0]);
        const unformattedPrice = stringPrice.slice(index, stringPrice.length);

        const divisionNumber = unformattedPrice.length > 2 ? 100 : 1;

        const formattedPrice = new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(unformattedPrice / divisionNumber);

        const line = new stockInfo({
          tickerName,
          companyName,
          tickerType,
          formattedPrice,
        });

        line.save();

        return { tickerName, companyName, tickerType, formattedPrice };
      });

      Fs.unlink(archivePath, (err) => {
        if (err) throw err;
      });
    }
  }
}

export default { runApp };
