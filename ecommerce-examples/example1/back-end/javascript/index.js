const express = require('express');
const chargebee = require('chargebee');
const path = require('path');
const fetchItems = require('./fetch-items');
const fetchItemPrices = require('./fetch-item-prices');
const fetchVariants = require('./fetch-variants');
const fetchProduct = require('./fetch-product');
const checkoutNew = require('./new-checkout');
const estimates = require('./fetch-estimates');
const purchases = require('./new-purchase');
const fetchCustomer = require('./fetch-customer');
const { siteName, API_KEY } = require('./constants');

// CORS is enabled only for demo. Please dont use this in production unless you know about CORS
const cors = require('cors');

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
chargebee.configure({
  site: siteName, // Enter your Side ID here
  api_key: API_KEY // Enter your Full access API key here
});
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

// Configure your static file paths here. Images, CSS and JS files should be inside this path
app.use('/static', express.static('../../front-end/javascript'));

/* 
  Fetch Item API
  request params - Product ID, Item type - plan/charge
*/
app.get('/api/fetch-items', fetchItems);

/* 
  Fetch Item Price API
  request params - Item ID
*/
app.get('/api/fetch-item-prices', fetchItemPrices);

/* 
  Fetch Variants API
  request params - Product ID
*/
app.get('/api/variants', async (req, res) => {
  await fetchVariants(req, res);
});

/* 
  Fetch Product API
  request params - Product ID
*/
app.get('/api/product', async (req, res) => {
  await fetchProduct(req, res);
});

/* 
  Fetch Checkout Link
  request params - Item Price ID, Customer ID (optional)
*/
app.post('/api/generate_checkout_new_url', checkoutNew);

/* 
  Fetch Estimates for the Cart items
*/
app.post('/api/calculate_estimates', async (req, res) => {
  await estimates(req, res);
});

/* 
  Creates new customer
*/
app.get('/api/fetch_customer', async (req, res) => {
  await fetchCustomer(req, res);
});

/* 
  Create new purchase for the Cart items
*/
app.post('/api/purchase', purchases);

// Configure the path of your HTML file to be loaded
app.get('/', (req, res) => {
  res.sendFile(
    path.join(__dirname, '../../front-end/javascript/widget/cb-widget.html')
  );
});

app.get('/cart', (req, res) => {
  res.sendFile(
    path.join(__dirname, '../../front-end/javascript/cart/cb-cart.html')
  );
});

app.get('/checkout', (req, res) => {
  res.sendFile(
    path.join(__dirname, '../../front-end/javascript/checkout/cb-checkout.html')
  );
});

app.listen(8000, () =>
  console.log('subscription-enrolment-example listening on port 8000!')
);
