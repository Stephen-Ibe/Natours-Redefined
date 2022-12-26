const fs = require('fs');
const http = require('http');
const url = require('url');

const slugify = require('slugify');

const replaceTemplate = require('./modules/replaceTemplate');

// html-templates
const overviewTemp = fs.readFileSync(`./templates/overview.html`, 'utf-8');
const cardTemp = fs.readFileSync(`./templates/card.html`, 'utf-8');
const productTemp = fs.readFileSync(`./templates/product.html`, 'utf-8');

const data = fs.readFileSync(`./data.json`, 'utf-8');
const dataObj = JSON.parse(data);
const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));

// Create a server
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });

    const cardView = dataObj
      .map((el) => replaceTemplate(cardTemp, el))
      .join('');
    const output = overviewTemp.replace('{%PRODUCT_CARDS%}', cardView);

    res.end(output);
  } else if (pathname === '/product') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const product = dataObj[query.id];
    const output = replaceTemplate(productTemp, product);

    res.end(output);
  } else if (pathname === '/api') {
    fs.readFile(`${__dirname}/data.json`, 'utf-8', (err, data) => {
      const productData = JSON.parse(data);
      res.writeHead(200, { 'Content-type': 'application/json' });
      res.end(data);
    });
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
    });
    res.end('<h1>Page not found</h1>');
  }
});

server.listen(4000, '127.0.0.1', (err) => {
  if (err) return console.log('💥');
  console.log('Listening on port 4000');
});
