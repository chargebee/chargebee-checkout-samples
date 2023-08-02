const fetch = require('node-fetch');
const siteName = 'SITE_ID';
const API_KEY = 'API_KEY';

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
  let variants = [];
  const response = await fetch(
    `https://${siteName}.chargebee.com/api/v2/products/${req.query.product_id}/variants`,
    {
      headers: {
        Authorization: `Basic ${Buffer.from(API_KEY).toString('base64')}`
      }
    }
  );
  const varJson = await response.json();
  for (let i = 0; i < varJson.list.length; i++) {
    const variant = varJson.list[i].variant;
    variants.push(variant);
  }
  res.status(200).json({ list: variants });
};
