const chargebee = require('chargebee');
module.exports = (req, res) => {
  let price = {};
  chargebee.item_price
    .list({
      limit: 100,
      'item_id[is]': req.query.item_id
    })
    .request(function (error, result) {
      if (error) {
        //handle error
        console.log(error);
      } else {
        for (var i = 0; i < result.list.length; i++) {
          var entry = result.list[i];
          var item = entry.item_price;
          if (price[item.variant_id]) {
            price[item.variant_id].push(item);
          } else {
            price[item.variant_id] = [item];
          }
        }
        res.status(200).json(price);
      }
    });
};
