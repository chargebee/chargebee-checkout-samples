const chargebee = require('chargebee');
const fetchItems = (req, res) => {
  chargebee.item
    .list({
      limit: 1,
      'status[is]': 'active',
      'product_id[is]': req.query.product_id,
      'type[is]': req.query.type
    })
    .request(function (error, result) {
      if (error) {
        //handle error
        console.log(error);
      } else {
        var item = {};
        if (result.list.length) {
          item = result.list[0].item;
        }
        res.status(200).json(item);
      }
    });
};
module.exports = fetchItems;
