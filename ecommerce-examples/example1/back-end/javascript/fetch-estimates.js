const fetch = require('node-fetch');
const { siteName, API_KEY } = require('./constants');

let credentialError = null;
if (siteName === 'SITE_ID' || !siteName) {
  credentialError =
    'Error: Kindly provide your Chargebee Site name at the Backend';
}
if (API_KEY === 'API_KEY' || !API_KEY) {
  credentialError =
    'Error: Kindly provide your Chargebee Site API key at the Backend';
}
if (credentialError) {
  throw Error(credentialError);
}
module.exports = async (req, res) => {
  let data = '',
    itemsLength = req.query?.purchase_items?.index?.length || 0;
  for (let i = 0; i < itemsLength; i++) {
    data = `${data}purchase_items[index][${i}]=${
      i + 1
    }&purchase_items[item_price_id][${i}]=${
      req.query.purchase_items.item_price_id[i]
    }&`;
    if (req.query.purchase_items.quantity) {
      data = `${data}purchase_items[quantity][${i}]=${req.query.purchase_items.quantity[i]}&`;
    }
  }
  if (req.query.customer_id) {
    data = data + 'customer_id=' + req.query.customer_id;
  }
  const response = await fetch(
    `https://${siteName}.chargebee.com/api/v2/purchases/estimate?${data}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        Authorization: `Basic ${Buffer.from(API_KEY).toString('base64')}`
      }
    }
  );
  const est = await response.json();
  if (est?.estimate?.invoice_estimates) {
    res.status(200).json(est.estimate.invoice_estimates[0]);
  } else {
    res.status(400).json(est);
  }
};
