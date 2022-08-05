import AdmZip from "adm-zip";
import Path from "path";
import Fs from "fs";
import https from "https";
import axios from "axios";

import StockModel from "../models/Stock.js";
import UserWalletModel from "../models/UserWallet.js";

const __dirname = Path.resolve();

let fridaySubtract = 3;
let yesterdaySubtract = 1;

async function getFile(fileName) {
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

export async function runApp() {
  await StockModel.deleteMany({});

  const date = new Date();

  const weekDay = date.getDay();

  if (weekDay !== 0) {
    const yesterday = new Date(date);

    weekDay === 1
      ? yesterday.setDate(yesterday.getDate() - fridaySubtract)
      : yesterday.setDate(yesterday.getDate() - yesterdaySubtract);

    const day =
      yesterday.getDate().toString().length === 1
        ? `0${yesterday.getDate()}`
        : yesterday.getDate();

    const month =
      (yesterday.getMonth() + 1).toString().length === 1
        ? `0${yesterday.getMonth() + 1}`
        : yesterday.getMonth() + 1;

    const fullYear = yesterday.getFullYear();
    const formattedDate = `${day}${month}${fullYear}`;
    try {
      const archivePath = await getFile(`COTAHIST_D${formattedDate}.ZIP`);

      if (archivePath) {
        StockModel.deleteMany({});
        const data = Fs.readFileSync(archivePath).toString().split("\n");
        data.pop();
        data.pop();
        data.shift();

        data.forEach(async (item) => {
          const tickerName = item.slice(12, 23).trim();
          const companyName = item.slice(27, 39).trim();
          const tickerType = item.slice(39, 42).trim();
          const stringPrice = item.slice(109, 121);

          const formattedPrice = Number(stringPrice) / 100;

          try {
            await UserWalletModel.updateMany(
              {
                "wallet.stock": tickerName.toLowerCase(),
              },
              { $set: { "wallet.$.price": formattedPrice } },
              { multi: true }
            );
          } catch (err) {
            console.error(err);
          }

          const line = new StockModel({
            tickerName,
            companyName,
            tickerType,
            formattedPrice,
          });

          await line.save();
        });

        Fs.unlink(archivePath, (err) => {
          if (err) return;
        });
      }
    } catch (error) {
      console.log(Buffer.from(error.response.data).toString());

      runApp(fridaySubtract + 1, yesterdaySubtract + 1);
    }
  }
}
