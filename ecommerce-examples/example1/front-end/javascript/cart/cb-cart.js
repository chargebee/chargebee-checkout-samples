var cbInstance = Chargebee.init({
  site: 'pc-pim-test', // your test site
  isItemsModel: true,
  enableMixCartCheckout: true
});

const CbCart = {
  inited: false,
  options: {},
  estimates: null,
  init: async function (options) {
    this.options = {
      ...this.options,
      options
    };
    await this.embedCart();
    document
      .querySelector('.cb-cart-button')
      .addEventListener('click', this.toggleCart);
    this.initializeLocalStorage();
  },
  embedCart: async function () {
    if (this.inited) return;
    const fetchTemplate = await fetch('/cart');
    const cart = await fetchTemplate.text();
    document.querySelector('.cb-cart-container').innerHTML = cart;
    this.inited = true;
  },
  initializeLocalStorage: function () {
    let localCart = localStorage.getItem('CbCart');
    if (localCart) {
      const { lastUpdated } = JSON.parse(localCart);
      const timeDiff = (Date.now() - lastUpdated) / (1000 * 60 * 60 * 24);
      if (parseInt(timeDiff) > 30) {
        localCart = null;
      }
    }
    if (!localStorage.getItem('CbCart')) {
      localStorage.setItem(
        'CbCart',
        JSON.stringify({
          ...(localCart || {
            ...cbInstance.getCart()
          }),
          lastUpdated: Date.now()
        })
      );
    }
    const cartProducts = JSON.parse(localCart)?.products || [];
    const cartInstance = cbInstance.getCart();
    cartInstance.products = cartProducts;
    for (let i = 0; i < cartProducts.length; i++) {
      this.renderCartItem(cartProducts[i]);
    }
  },
  updateLocalStorage: function () {
    localStorage.setItem(
      'CbCart',
      JSON.stringify({
        ...cbInstance.getCart(),
        lastUpdated: Date.now()
      })
    );
  },
  addProductToCart: function (productOptions) {
    const cart = cbInstance.getCart();
    const existingProduct = this.findProduct(productOptions.itemPriceId);
    if (existingProduct) {
      if (existingProduct.planQuantity + productOptions.quantity < 1) return;
      existingProduct.planQuantity += productOptions.quantity;
      existingProduct.data = {
        ...existingProduct.data,
        quantity: existingProduct.planQuantity
      };
      this.updateCartRow(existingProduct);
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
    this.addCustomData(product, productOptions);
    cart.products.push(product);
    this.renderCartItem(product);
  },
  addCustomData: function (product, productParams) {
    product.data = {
      productName: productParams.productInfo.name,
      image: productParams.productInfo.image,
      variantName: productParams.productInfo.variantName,
      deliveryInfo: productParams.productInfo.deliveryInfo,
      quantity: product.planQuantity,
      unitPrice: productParams.productInfo.price,
      currencyCode: this.options.currency
    };
  },
  renderCartItem: function (product) {
    const template = (data) => {
      return `
        <div class="cb-item-image">
          <img class="" src="${
            data.image || 'https://placehold.co/125x150?text=No+Image'
          }">
        </div>
        <div class="cb-item-detail">
          <div class="cb-productInfo">
            ${data.productName} - ${data.variantName}
            <div class="cb-delivery-info">
              ${data.deliveryInfo}
            </div>
          </div>
          <div class="cb-unitPrice">
            ${data.unitPrice} ${data.currencyCode}
          </div>
          <div class="cb-cart-item-quantity">
            <label class="">qty:</label>
            <div class="cb-quantity-wrapper">
              <button class="cb-decrement-btn" onclick="CbCart.modifyQuantity('${
                data.id
              }', -1)">-</button>
              <span class="cb-cart-item-quantity-input">${data.quantity}</span>
              <button class="cb-increment-btn" onclick="CbCart.modifyQuantity('${
                data.id
              }', 1)">+</button>
            </div>
          </div>
          <div
            class="cb-cart-item-remove"
            onclick="CbCart.deleteCartItem('${data.id}')"
          >
            Remove
          </div>
        </div>
      `;
    };
    const wrapper = document.querySelector('.cb-cart-items-wrapper');
    const row = document.createElement('div');
    row.id = product.items[0].item_price_id;
    row.className = 'cb-cart-item-container';
    row.innerHTML = template({
      id: product.items[0].item_price_id,
      ...product.data
    });
    wrapper.appendChild(row);
    this.updateCartQuantity();
    this.calculateEstimate();
    if (!document.querySelector('.cb-cart-empty.cb-hide')) {
      document.querySelector('.cb-cart-empty').className =
        'cb-cart-empty cb-hide';
      document.querySelector('.cb-cart-hasitem').className = 'cb-cart-hasitem';
    }
  },
  updateCartQuantity: function () {
    const cart = cbInstance.getCart();
    const countContainer = document.querySelector('.cb-cart-quantity');
    countContainer.innerText = cart.products.length;
  },
  updateCartRow: function (product) {
    const priceId = product.items[0].item_price_id;
    const row = document.querySelector(`#${priceId}`);
    row.querySelector('.cb-cart-item-quantity-input').innerText =
      product.planQuantity;
    this.calculateEstimate();
  },
  deleteCartItem: function (itemPriceId) {
    const cart = cbInstance.getCart();
    const productIndex = cart.products.findIndex((item) => {
      return item.items[0].item_price_id === itemPriceId;
    });
    document.querySelector(`#${itemPriceId}`)?.remove();
    cart.products.splice(productIndex, 1);
    this.updateCartQuantity();
    if (!cart.products.length) {
      this.clearCart();
    } else {
      this.calculateEstimate();
    }
  },
  calculateEstimate: async function () {
    let query = '';
    const cart = cbInstance.getCart();
    cart.products.forEach((product, index) => {
      query = `${query}purchase_items[index][${index}]=${
        index + 1
      }&purchase_items[item_price_id][${index}]=${
        product.items[0].item_price_id
      }&`;
      query = `${query}purchase_items[quantity][${index}]=${product.planQuantity}&`;
    });
    document.querySelector('#cb-cart-total-display').innerText =
      'calculating...';
    try {
      const res = await fetch(`/api/calculate_estimates?${query}`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
        }
      });
      const estimates = await res.json();
      this.estimates = estimates;
    } catch (err) {
      console.error(err);
    }
    this.updateCartPrice();
    this.updateLocalStorage();
  },
  updateCartPrice: function () {
    if (this.estimates.total) {
      document.querySelector('#cb-cart-total-display').innerText = `${(
        this.estimates.total / 100
      ).toFixed(2)} ${this.options.currency}`;
    }
  },
  findProduct: function (itemPriceId) {
    const cart = cbInstance.getCart();
    const productIndex = cart.products.findIndex((item) => {
      return item.items[0].item_price_id === itemPriceId;
    });
    return productIndex !== -1 ? cart.products[productIndex] : null;
  },
  modifyQuantity: function (itemPriceId, qty) {
    this.addProductToCart({
      itemPriceId,
      quantity: qty
    });
  },
  clearCart: function () {
    const cart = cbInstance.getCart();
    cart.products = [];
    document.querySelector('.cb-cart-empty').className = 'cb-cart-empty';
    document.querySelector('.cb-cart-hasitem').className =
      'cb-cart-hasitem cb-hide';
    document.querySelector('.cb-cart-items-wrapper').innerHTML = '';
    this.updateCartQuantity();
    this.updateLocalStorage();
  },
  toggleCart: function () {
    if (document.querySelector('.cb-cart-container.open')) {
      document.querySelector('.cb-cart-container').className =
        'cb-cart-container close';
    } else {
      document.querySelector('.cb-cart-container').className =
        'cb-cart-container open';
    }
  }
};

CbCart.init({
  currency: 'USD'
});
