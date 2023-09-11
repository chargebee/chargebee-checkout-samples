var cbInstance = Chargebee.init({
  site: 'pc-pim-test', // your test site
  isItemsModel: true,
  enableMixCartCheckout: true
});

const CbCart = {
  inited: false,
  init: async function () {
    await this.embedCart();
    document.querySelector('.cb-cart-button').addEventListener('click', (e) => {
      if (document.querySelector('.cb-cart-container.open')) {
        document.querySelector('.cb-cart-container').className =
          'cb-cart-container close';
      } else {
        document.querySelector('.cb-cart-container').className =
          'cb-cart-container open';
      }
    });
  },
  embedCart: async function () {
    if (this.inited) return;
    const fetchTemplate = await fetch('/cart');
    const cart = await fetchTemplate.text();
    document.querySelector('.cb-cart-container').innerHTML = cart;
    this.inited = true;
  },
  addProductToCart: function (productOptions) {
    const cart = cbInstance.getCart();
    if (this.findProduct(productOptions.itemPriceId)) {
      const product = this.findProduct(productOptions.itemPriceId);
      product.planQuantity += productOptions.quantity;
      return;
    }
    const product = cbInstance.initializeProduct(
      productOptions.itemId,
      productOptions.quantity,
      true
    );
    product.addItem(
      product.createItem(
        productOptions.itemPriceId,
        productOptions.quantity,
        productOptions.type
      )
    );
    cart.products.push(product);
  },
  openCart: function () {},
  calculateEstimate: function () {},
  findProduct: function (itemPriceId) {
    const cart = cbInstance.getCart();
    const productIndex = cart.products.findIndex((item) => {
      return item.items[0].item_price_id === itemPriceId;
    });
    return productIndex !== -1 ? cart.products[productIndex] : null;
  },
  modifyQuantity: function (itemPriceId, qty) {
    const cart = cbInstance.getCart();
  },
  removeProduct: function (itemPriceId) {
    const cart = cbInstance.getCart();
    const productIndex = cart.products.findIndex((item) => {
      return item.items[0].item_price_id === itemPriceId;
    });
    if (productIndex !== -1) {
      cart.products.splice(productIndex, 1);
    }
  },
  clearCart: function () {
    const cart = cbInstance.getCart();
    cart.products = [];
  },
  proceedToCheckout: function () {
    cbInstance.openCheckout({});
  }
};

CbCart.init();
