import AdmZip from "adm-zip";
import Path from "path";
import Fs from "fs";
import https from "https";
import axios from "axios";

import StockModel from "../models/Stock.js";
import UserWalletModel from "../models/UserWallet.js";

const __dirname = Path.resolve();

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

async function runApp(fridaySubtract = 3, yesterdaySubtract = 1) {
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
    const month = yesterday.getMonth() + 1;

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

          const formattedPriceWithoutSign = formattedPrice
            .slice(2)
            .replace(".", "")
            .replace(",", ".")
            .trim();

          const formattedNumberPrice = Number(formattedPriceWithoutSign);
          try {
            await UserWalletModel.updateMany(
              {
                "wallet.stock": tickerName.toLowerCase(),
              },
              { $set: { "wallet.$.price": formattedNumberPrice } },
              { multi: true }
            );
          } catch (err) {
            console.error(err);
          }

          const line = new StockModel({
            tickerName,
            companyName,
            tickerType,
            formattedPrice: formattedPrice.slice(2).replace(",", ".").trim(),
          });

          line.save();
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

export default { runApp };
