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
  const response = await fetch(
    `https://${siteName}.chargebee.com/api/v2/purchases/estimate`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(API_KEY).toString('base64')}`
      },
      body: 'customer_id=aras_shaffer&purchase_items[index][0]=1&purchase_items[item_price_id][0]=Pack-of-1-Soap-Soap-charge-USD'
    }
  );
  const est = await response.json();
  console.log(est);
  res.status(200).json(est);
};
