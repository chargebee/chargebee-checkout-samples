const express = require('express');
const chargebee = require('chargebee');
const path = require('path');
const fetch = require('node-fetch');

// CORS is enabled only for demo. Please dont use this in production unless you know about CORS
const cors = require('cors');

chargebee.configure({
  site: 'pc-pim-test', // Enter your Side ID here
  api_key: 'test_PYwqzG6AlNRLDlmIzVTvz1iN97C6O0VZ' // Enter your publishable API key here
});
const app = express();

app.use(express.urlencoded());
app.use(cors());

// Configure your static file paths here. Images, CSS and JS files should be inside this path
app.use('/static', express.static('../../front-end/javascript'));

/* 
  Fetch Item API
  request params - Product ID, Item type - plan/charge
*/
app.get('/api/fetch-items', (req, res) => {
  chargebee.item
    .list({
      limit: 1,
      'status[is]': 'active',
      'product_id[is]': req.query.product_id,
      'type[is]': req.query.type
    })
    .request(function (error, result) {
      if (error) {
        //handle error
        console.log(error);
      } else {
        var item;
        if (result.list.length) {
          item = result.list[0].item;
        }
        res.status(200).json(item);
      }
    });
});

/* 
  Fetch Item Price API
  request params - Item ID
*/
app.get('/api/fetch-item-prices', (req, res) => {
  let price = {};
  chargebee.item_price
    .list({
      limit: 100,
      'item_id[is]': req.query.item_id
    })
    .request(function (error, result) {
      if (error) {
        //handle error
        console.log(error);
      } else {
        for (var i = 0; i < result.list.length; i++) {
          var entry = result.list[i];
          var item = entry.item_price;
          if (price[item.variant_id]) {
            price[item.variant_id].push(item);
          } else {
            price[item.variant_id] = [item];
          }
        }
        res.status(200).json(price);
      }
    });
});

/* 
  Fetch Variants API
  request params - Product ID
*/
app.get('/api/variants', async (req, res) => {
  let variants = [];
  const response = await fetch(
    `https://${siteName}.chargebee.com/api/v2/products/${req.query.product_id}/variants`,
    {
      headers: {
        Authorization: `Basic ${Buffer.from(
          'test_PYwqzG6AlNRLDlmIzVTvz1iN97C6O0VZ'
        ).toString('base64')}`
      }
    }
  );
  const varJson = await response.json();
  for (let i = 0; i < varJson.list.length; i++) {
    const variant = varJson.list[i].variant;
    variants.push(variant);
  }
  res.status(200).json({ list: variants });
});

// Configure the path of your HTML file to be loaded
app.get('/', (req, res) => {
  res.sendFile(
    path.join(__dirname, '../../front-end/javascript/cb-widget.html')
  );
});

app.listen(8000, () =>
  console.log('subscription-enrolment-example listening on port 8000!')
);
