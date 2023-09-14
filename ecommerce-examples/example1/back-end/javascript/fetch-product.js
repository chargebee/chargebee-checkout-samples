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
    `https://${siteName}.chargebee.com/api/v2/products/${req.query.product_id}`,
    {
      headers: {
        Authorization: `Basic ${Buffer.from(API_KEY).toString('base64')}`
      }
    }
  );
  const productWrapper = await response.json();
  res.status(200).json(productWrapper.product);
};
