const chargebee = require('chargebee');
module.exports = (req, res) => {
  try {
    const isPlan = req.query.item_type === 'plan';
    const checkoutCallback = isPlan
      ? chargebee.hosted_page.checkout_new_for_items
      : chargebee.hosted_page.checkout_one_time_for_items;
    delete req.query.item_type;
    const params = isPlan
      ? req.query
      : {
          ...req.query,
          item_prices: req.query.subscription_items
        };
    console.log(isPlan, params);
    checkoutCallback(params).request(function (error, result) {
      if (error) {
        //handle error
        console.log(error);
      } else {
        res.send(result.hosted_page);
      }
    });
  } catch (e) {
    console.log(e);
  }
};
