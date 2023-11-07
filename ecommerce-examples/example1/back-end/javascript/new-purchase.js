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
    itemsLength = req.query.purchase_items.index.length,
    customerQuery = `email=${req.query.shipping_addresses.email[0]}&first_name=${req.query.shipping_addresses.first_name[0]}&last_name=${req.query.shipping_addresses.last_name[0]}&billing_address[first_name]=${req.query.billing_address.first_name}&billing_address[last_name]=${req.query.billing_address.last_name}&billing_address[email]=${req.query.billing_address.email}&billing_address[line1]=${req.query.billing_address.line1}&billing_address[line2]=${req.query.billing_address.line2}&billing_address[city]=${req.query.billing_address.city}&billing_address[zip]=${req.query.billing_address.zip}&billing_address[country]=${req.query.billing_address.country}&token_id=${req.query.token_id}`;
  if (req.query.customer_id === 'undefined') {
    const response = await fetch(
      `https://${siteName}.chargebee.com/api/v2/customers?${customerQuery}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(API_KEY).toString('base64')}`
        }
      }
    );
    const customerObj = await response.json();
    req.query.customer_id = customerObj?.customer?.id;
  } else {
    const response = await fetch(
      `https://${siteName}.chargebee.com/api/v2/customers/${req.query.customer_id}?${customerQuery}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(API_KEY).toString('base64')}`
        }
      }
    );
    const customerObj = await response.json();
    req.query.customer_id = customerObj?.customer?.id;
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
  data = `${data}customer_id=${req.query.customer_id}&shipping_addresses[first_name][0]=${req.query.shipping_addresses.first_name[0]}&shipping_addresses[last_name][0]=${req.query.shipping_addresses.last_name[0]}&shipping_addresses[email][0]=${req.query.shipping_addresses.email[0]}&shipping_addresses[line1][0]=${req.query.shipping_addresses.line1[0]}&shipping_addresses[line2][0]=${req.query.shipping_addresses.line2[0] || ''}&shipping_addresses[city][0]=${req.query.shipping_addresses.city[0]}&shipping_addresses[zip][0]=${req.query.shipping_addresses.zip[0]}&shipping_addresses[country][0]=${req.query.shipping_addresses.country[0]}`;
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
  if (est.purchase) {
    res.status(200).json(est);
  } else {
    res.status(400).json(est);
  }
};
