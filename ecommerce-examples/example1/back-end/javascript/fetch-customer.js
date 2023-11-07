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
    `https://${siteName}.chargebee.com/api/v2/customers/${req.query.customer_id}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Basic ${Buffer.from(API_KEY).toString('base64')}`
      }
    }
  );
  const customerObj = await response.json();
  if (customerObj.customer.primary_payment_source_id) {
    const response = await fetch(
      `https://${siteName}.chargebee.com/api/v2/payment_sources/${customerObj.customer.primary_payment_source_id}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Basic ${Buffer.from(API_KEY).toString('base64')}`
        }
      }
    );
    const pmSource = await response.json();
    customerObj.customer.payment_source = pmSource.payment_source;
  }
  res.status(200).json(customerObj.customer);
};
