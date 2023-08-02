const express = require('express')
const chargebee = require("chargebee")
// CORS is enabled only for demo. Please dont use this in production unless you know about CORS
const cors = require('cors')
const bodyParser = require('body-parser')
chargebee.configure({
  site : "cbdinesh-pc20-test", 
  api_key : "test_ztViRtm5zZdNC8jZNAZvoQMBLOBtUW0Q"
});

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

app.post("/api/generate_checkout_new_url", async (req, res) => {
  try {
    const payload = req.body;
    const { hosted_page } = await chargebee.hosted_page.checkout_new_for_items({
      subscription_items: [
        {
          item_price_id: payload.plan,
          quantity: 1,
        }
      ],
      customer: {
        id: "cbdemo_john"
      },
      // To use redirect URL, please whitelist the application origin URL under 
      // Chargebee > Settings > Checkout & Self-serve Portal > Configuration > Add domains
      // Ex: http://localhost:4200
      redirectUrl: 'https://www.google.com' 
    }).request();
    res.json(hosted_page);
  } catch(e) {
    res.status(400);
    res.json({ 
      success: false,
      error_message: e.message
    })
  }
});

app.post("/api/generate_checkout_existing_url", async (req, res) => {
  try {
    const subId = req.body.subscriptionId;
    const { hosted_page } = await chargebee.hosted_page.checkout_existing_for_items({
      subscription : {
        id : subId
      }, 
    }).request();
    res.json(hosted_page);
  } catch(e) {
    res.status(400);
    res.json({ 
      success: false,
      error_message: e.message
    })
  }
});

app.post("/api/generate_update_payment_method_url", async (req, res) => {
  try {
    const { hosted_page } = await chargebee.hosted_page.manage_payment_sources({
      customer : {
        id : "cbdemo_john"
      }, 
    }).request();
    res.json(hosted_page);
  } catch(e) {
    res.status(400);
    res.json({
      success: false,
      error_message: e.message
    })
  }
});

app.post("/api/generate_portal_session", async (req, res) => {
  try {
    const { portal_session } = await chargebee.portal_session.create({
      customer : {
        id : "cbdemo_john"
      }, 
    }).request();
    res.json(portal_session);
  } catch(e) {
    res.status(400);
    res.json({
      success: false,
      error_message: e.message
    })
  }
});

app.post('/api/generate_payment_intent', async (req, res) => {
  try {
    const { payment_intent } = await chargebee.payment_intent.create(req.body).request();
    res.json(payment_intent);
  } catch(e) {
    res.status(400);
    res.json({
      success: false,
      error_message: e.message
    })
  }
});

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(8000, () => console.log('Example app listening on port 8000!'))
