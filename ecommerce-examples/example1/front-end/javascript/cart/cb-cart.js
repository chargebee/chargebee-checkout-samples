var cbInstance = Chargebee.init({
  site: 'pc-pim-test', // your test site
  isItemsModel: true,
  enableMixCartCheckout: true
});

const CbCart = {
  inited: false,
  estimates: null,
  init: async function () {
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
      const timeDiff = (Date.now() - lastUpdated)/(1000 * 60 * 60 * 24);
      if (parseInt(timeDiff) > 30) {
        localCart = null;
      }
    }
    if (!localStorage.getItem('CbCart')) {
      localStorage.setItem(
        'CbCart',
        JSON.stringify({
          ...localCart || {
            ...cbInstance.getCart()
          },
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
      if (
        existingProduct.planQuantity + productOptions.quantity < 1 ||
        productOptions.pricingModel === 'flat_fee'
      )
        return;
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
    this.addCustomData(product);
    cart.products.push(product);
    this.renderCartItem(product);
  },
  addCustomData: function (product) {
    if (!CbWidget.inited) return;
    const type = product.items[0].item_type,
      id = product.items[0].item_price_id;
    let deliveryInfo = '',
      unitPrice = 0,
      currency = '';
    const variant = CbWidget.variants.find((variant) => {
      const prices =
        type === 'charge'
          ? CbWidget.widgetData[variant.id].oneTimePrices
          : CbWidget.widgetData[variant.id].subscriptionPrices;
      const priceObj = prices.find((price) => id === price.id);
      if (priceObj) {
        if (type === 'plan') {
          deliveryInfo = `Delivers every ${
            priceObj.shipping_period === 1 ? '' : priceObj.shipping_period
          } `;
          deliveryInfo = `${deliveryInfo.trim()} ${
            priceObj.shipping_period_unit
          }${priceObj.shipping_period === 1 ? '' : 's'}`;
        } else {
          deliveryInfo = 'Shipped once';
        }
        unitPrice = (priceObj.price / 100).toFixed(2);
        currency = priceObj.currency_code;
        return true;
      }
      return false;
    });
    product.data = {
      productName: CbWidget.productName,
      variantName: variant.name,
      deliveryInfo: deliveryInfo,
      quantity: product.planQuantity,
      unitPrice: unitPrice,
      currencyCode: currency,
      pricingModel: CbWidget.widgetData.selectedFrequency.pricingModel
    };
  },
  renderCartItem: function (product) {
    const wrapper = document.querySelector('.cb-cart-items-wrapper');
    const row = this.createDOM('div', 'cb-cart-item-container'),
      imgContainer = this.createDOM('div', 'cb-item-image'),
      img = this.createDOM('img'),
      itemDetail = this.createDOM('div', 'cb-item-detail'),
      productInfo = this.createDOM('div', 'cb-productInfo'),
      deliveryInfo = this.createDOM('div', 'cb-delivery-info'),
      unitPrice = this.createDOM('div', 'cb-unitPrice'),
      qtyContainer = this.createDOM('div', 'cb-cart-item-quantity'),
      qtyLabel = this.createDOM('label'),
      qtyWrapper = this.createDOM('div', 'cb-quantity-wrapper'),
      reduceBtn = this.createDOM('button', 'cb-decrement-btn'),
      incBtn = this.createDOM('button', 'cb-increment-btn'),
      qtyInput = this.createDOM('span', 'cb-cart-item-quantity-input'),
      removeBtn = this.createDOM('div', 'cb-cart-item-remove');
    row.id = product.items[0].item_price_id;
    img.src =
      'https://imageio.forbes.com/specials-images/imageserve/63fa34abd4092acbb40f01bf/Apple--iPhone-15--iPhone-15-Pro--iPhone-15-Pro-Max--iPhone-15-colors--iPhone-15-Pro/0x0.jpg?crop=891,1055,x245,y0,safe&height=841&width=125&fit=bounds';
    imgContainer.appendChild(img);
    row.appendChild(imgContainer);
    productInfo.innerText = `${product.data.productName} - ${product.data.variantName}`;
    deliveryInfo.innerText = `${product.data.deliveryInfo}`;
    productInfo.appendChild(deliveryInfo);
    itemDetail.appendChild(productInfo);
    unitPrice.innerText = `${product.data.unitPrice} ${product.data.currencyCode}`;
    itemDetail.appendChild(unitPrice);
    qtyLabel.innerText = 'qty:';
    qtyContainer.appendChild(qtyLabel);
    reduceBtn.innerText = '-';
    reduceBtn.addEventListener('click', () =>
      CbCart.modifyQuantity(product.items[0].item_price_id, -1)
    );
    qtyWrapper.appendChild(reduceBtn);
    qtyInput.innerText = product.planQuantity;
    qtyWrapper.appendChild(qtyInput);
    incBtn.innerText = '+';
    incBtn.addEventListener('click', () =>
      CbCart.modifyQuantity(product.items[0].item_price_id, 1)
    );
    qtyWrapper.appendChild(incBtn);
    qtyContainer.appendChild(qtyWrapper);
    itemDetail.appendChild(qtyContainer);
    removeBtn.innerText = 'Remove';
    removeBtn.dataset.itemId = product.items[0].item_price_id;
    removeBtn.addEventListener('click', () =>
      CbCart.deleteCartItem(product.items[0].item_price_id)
    );
    itemDetail.appendChild(removeBtn);
    row.appendChild(itemDetail);
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
      if (product.data.pricingModel !== 'flat_fee') {
        query = `${query}purchase_items[quantity][${index}]=${product.planQuantity}&`;
      }
    });
    document.querySelector('#cb-cart-total-display').innerText =
      'calculating...';
    const res = await CbWidget.fetchCBApi(`/api/calculate_estimates?${query}`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    });
    this.estimates = res;
    this.updateCartPrice();
    this.updateLocalStorage();
  },
  updateCartPrice: function () {
    if (this.estimates.total) {
      document.querySelector('#cb-cart-total-display').innerText = `${(
        this.estimates.total / 100
      ).toFixed(2)} ${CbWidget.options.currency}`;
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
  },
  createDOM: function (tagName = 'div', className = '') {
    const dom = document.createElement(tagName);
    dom.className = className;
    return dom;
  }
};

CbCart.init();
