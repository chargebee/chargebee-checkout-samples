const chargebee = require('chargebee');
module.exports = (req, res) => {
  try {
    const isPlan = req.query.item_type === 'plan';
    const checkoutCallback = isPlan
      ? chargebee.hosted_page.checkout_new_for_items
      : chargebee.hosted_page.checkout_one_time_for_items;
    delete req.query.item_type;
    if (!req.query.customer.id) {
      delete req.query.customer.id;
    }
    let params = null;
    if (isPlan) {
      params = req.query;
    } else {
      // For one time purchase, the subscription_items prop is replaced with item_prices
      const {subscription_items, ...rest} = req.query
      params = {
        ...rest,
        item_prices: subscription_items
      }
    }
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
