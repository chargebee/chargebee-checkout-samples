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
    itemsLength = req.query.purchase_items.index.length;
  if (!req.query.customer_id) {
    const response = await fetch(
      `https://${siteName}.chargebee.com/api/v2/customers?email=${req.query.shipping_addresses.email[0]}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(API_KEY).toString('base64')}`
        }
      }
    );
    const customerObj = await response.json();
    req.query.customer_id = customerObj?.customer?.id;
    console.log(customerObj);
  }
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
  console.log(req.query)
  data = `${data}customer_id=${req.query.customer_id}&shipping_addresses[first_name][0]=${req.query.shipping_addresses.first_name[0]}&shipping_addresses[last_name][0]=${req.query.shipping_addresses.last_name[0]}&shipping_addresses[email][0]=${req.query.shipping_addresses.email[0]}&shipping_addresses[line1][0]=${req.query.shipping_addresses.line1[0]}&shipping_addresses[city][0]=${req.query.shipping_addresses.city[0]}&shipping_addresses[zip][0]=${req.query.shipping_addresses.zip[0]}&shipping_addresses[country][0]=${req.query.shipping_addresses.country[0]}`;
  const response = await fetch(
    `https://${siteName}.chargebee.com/api/v2/purchases`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(API_KEY).toString('base64')}`
      },
      body: data
    }
  );
  const est = await response.json();
  console.log(est);
  if (est.purchase) {
    res.status(200).json(est);
  } else {
    res.status(400).json(est);
  }
};
