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
    document.querySelector('.cb-cart-button').addEventListener('click', (e) => {
      if (document.querySelector('.cb-cart-container.open')) {
        document.querySelector('.cb-cart-container').className =
          'cb-cart-container close';
      } else {
        document.querySelector('.cb-cart-container').className =
          'cb-cart-container open';
      }
    });
    const selectElement = document.querySelector('.cb-customer-info [name=country]');
    CbCountries.forEach((country) => {
      const option = document.createElement('option');
      option.value = country.Code;
      option.textContent = country.Name;
      selectElement.appendChild(option);
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
    const existingProduct = this.findProduct(productOptions.itemPriceId);
    if (existingProduct) {
      if (
        existingProduct.planQuantity + productOptions.quantity < 1 ||
        productOptions.pricingModel === 'flat_fee'
      )
        return;
      existingProduct.planQuantity += productOptions.quantity;
      existingProduct.setCustomData({
        quantity: existingProduct.planQuantity
      });
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
    if (!document.querySelector('.cb-cart-empty.cb-hide')) {
      document.querySelector('.cb-cart-empty').className =
        'cb-cart-empty cb-hide';
      document.querySelector('.cb-cart-hasitem').className = 'cb-cart-hasitem';
    }
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
    product.setCustomData({
      productName: CbWidget.productName,
      variantName: variant.name,
      deliveryInfo: deliveryInfo,
      quantity: product.planQuantity,
      unitPrice: unitPrice,
      currencyCode: currency,
      pricingModel: CbWidget.widgetData.selectedFrequency.pricingModel
    });
  },
  renderCartItem: function (product) {
    const wrapper = document.querySelector('.cb-cart-items-table tbody');
    const row = document.createElement('tr');
    const data = {
      productInfo: `${product.data.productName} - ${product.data.variantName}<div class='cb-delivery-info'>${product.data.deliveryInfo}</div>`,
      quantity:
        product.data.pricingModel === 'flat_fee' ? '-' : product.planQuantity,
      unitPrice:
        product.data.pricingModel === 'flat_fee'
          ? '-'
          : `${product.data.unitPrice} ${product.data.currencyCode}`,
      total: `${(product.planQuantity * product.data.unitPrice).toFixed(2)} ${
        product.data.currencyCode
      }`
    };
    for (let prop in data) {
      const column = document.createElement('td');
      column.className = `cb-${prop}`;
      row.id = product.items[0].item_price_id;
      if (prop === 'productInfo') {
        column.innerHTML = data[prop];
      } else if (prop === 'quantity' && data[prop] !== '-') {
        column.innerHTML = `<div class="cb-cart-item-quantity">
          <div class="cb-quantity-wrapper">
            <button type="button" class="cb-decrement-btn" onclick="CbCart.modifyQuantity('${product.items[0].item_price_id}', -1)">-</button>
            <span class="cb-cart-item-quantity-input">${data[prop]}</span>
            <button type="button" class="cb-increment-btn" onclick="CbCart.modifyQuantity('${product.items[0].item_price_id}', 1)">+</button>
          </div>
        </div>`;
      } else {
        column.innerText = data[prop];
      }
      row.appendChild(column);
    }
    const deleteBtn = document.createElement('td');
    deleteBtn.innerHTML = `<span class='cb-cart-item-remove' data-item-id='${product.items[0].item_price_id}' onclick='CbCart.deleteCartItem("${product.items[0].item_price_id}")'>x</span>`;
    row.appendChild(deleteBtn);
    wrapper.appendChild(row);
    this.updateCartQuantity();
    this.calculateEstimate();
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
    row.querySelector('.cb-total').innerText = `${(
      product.planQuantity * product.data.unitPrice
    ).toFixed(2)} ${product.data.currencyCode}`;
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
    document.querySelector('#cb-cart-total-display').innerText = 'calculating...';
    const res = await CbWidget.fetchCBApi(`/api/calculate_estimates?${query}`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    });
    this.estimates = res;
    this.updateCartPrice();
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
    document.querySelector('.cb-cart-empty').className = 'cb-cart-empty';
    document.querySelector('.cb-cart-hasitem').className =
      'cb-cart-hasitem cb-hide';
    this.updateCartQuantity();
  },
  createCustomer: async function(cusInfo) {
    const res = await CbWidget.fetchCBApi(
      `/api/create_customer?email=${cusInfo.email}`,
      {
        method: 'POST'
      }
    );
    CbWidget.options.customer_id = res.id;
  },
  proceedToCheckout: async function (e) {
    e.preventDefault();
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
    const formData = {
      firstName: document.querySelector('.cb-customer-info [name=firstName]')
        .value,
      lastName: document.querySelector('.cb-customer-info [name=lastName]')
        .value,
      email: document.querySelector('.cb-customer-info [name=email]').value,
      line1: document.querySelector('.cb-customer-info [name=line1]').value,
      city: document.querySelector('.cb-customer-info [name=city]').value,
      zip: document.querySelector('.cb-customer-info [name=zip]').value,
      country: document.querySelector('.cb-customer-info [name=country]').value,
    };
    query = `${query}customer_id=${CbWidget.options.customer_id}&shipping_addresses[first_name][0]=${formData.firstName}&shipping_addresses[last_name][0]=${formData.lastName}&shipping_addresses[email][0]=${formData.email}&shipping_addresses[line1][0]=${formData.line1}&shipping_addresses[city][0]=${formData.city}&shipping_addresses[zip][0]=${formData.zip}&shipping_addresses[country][0]=${formData.country}`;
    try {
      const res = await CbWidget.fetchCBApi(`/api/purchase?${query}`, {
        method: 'POST'
      })
      this.clearCart();
    } catch (err) {
      console.log(res);
    }

  }
};

CbCart.init();