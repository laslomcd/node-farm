const fs = require("fs");
const http = require("http");
const url = require("url");

////////////////////////////////////////////////**
// FILES

// Synchronous Way
// const text = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(text);

// const textOut = `This is what we know about the avocado: ${text}.\nCreated on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("File has been written");

// Asynchronous Way
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
//       console.log(data3);
//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
//         console.log("This file has been written");
//       });
//     });
//   });
// });
// console.log("Will Read File");

/////////////////////////**
// SERVER
const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (product.organic)
    output = output.replace(/{%NOTORGANIC%}/g, "not-organic");

  return output;
};
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const productData = JSON.parse(data);

const server = http.createServer((req, res) => {
  const pathname = req.url;

  // Overview Page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "Content-Type": "text/html",
    });
    const cardsHTML = productData
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace(/{%PRODUCTCARDS%}/g, cardsHTML);
    res.end(output);

    // Product Page
  } else if (pathname === "/product") {
    res.end("This is the Product Page");

    // API Page
  } else if (pathname === "/api") {
    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.end(data);

    // 404 Page
  } else {
    res.writeHead(404, {
      "Content-Type": "text/html",
      "my-own-header": "Hello world",
    });
    res.end("<h1>Page Not Found</h1>");
  }
});

server.listen(8000, "localhost", () => {
  console.log("Server has started");
});
