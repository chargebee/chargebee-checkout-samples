// CbWidget contains all the logic required to build the Widget
const CbWidget = {
  inited: false,
  options: {
    customer_id: '', // Optional
    product_id: '', // Mandatory
    variantSelector: 'select', // button/select
    currency: 'USD', // Valid Currency Code
    showAddToCart: true, // Display Add to Cart in your widget
    showSubscribeNow: true // Display Subscribe now in your widget
  },
  productName: '',
  variants: [],
  quantity: 1,
  prices: {
    subscriptionPrices: [],
    oneTimePrices: []
  },
  widgetData: {}, // Populate data to this property and use it to build widget
  selectors: {
    loadingContainer: document.getElementsByClassName(
      'cb-loading-container'
    )[0],
    loadedContainer: document.getElementsByClassName('cb-widget-loaded')[0],
    variantSelector: document.getElementsByClassName('cb-variant-selector')[0]
  },
  // Utility to make API call to your backend
  fetchCBApi: async function (url, options = {}) {
    const response = await fetch(url, options);
    return response.json();
  },
  // initialize CbWidget. Entry point to get started
  init: async function (options = {}) {
    if (!options.product_id) {
      alert('Kindly provide Product ID while initializing CbWidget!');
    }
    // Override default options with the custom options
    this.options = {
      ...this.options,
      ...options
    };
    // Fetch APIs required to populate data in widgetData
    await this.retrieveData();
    // Use the data and options provided to construct the widget data
    this.constructWidgetData();
    // Using the widgetData render the widget on the page
    this.renderWidget();
    // Trigger click/change event on Variant selector to pre-select the first Variant by default
    if (this.options.variantSelector === 'button') {
      document.querySelector('.cb-variant-select-wrapper button').click();
    } else {
      document
        .querySelector('.cb-variant-select')
        .dispatchEvent(new Event('change'));
    }
    // Add event handlers for '-' and '+' buttons of Quantity selectors
    document
      .querySelector('.cb-quantity .cb-decrement-btn')
      .addEventListener('click', () => this.quantityModifier(-1));
    document
      .querySelector('.cb-quantity .cb-increment-btn')
      .addEventListener('click', () => this.quantityModifier(1));
    // Show blocks based on the options provided
    if (!this.options.showAddToCart) {
      this.toggleBlock('#cb-add-to-cart', true);
    } else {
      document
        .querySelector('#cb-add-to-cart')
        .addEventListener('click', () => {
          CbCart.addProductToCart({
            itemId: this.widgetData.selectedFrequency.itemId,
            itemPriceId: this.widgetData.selectedFrequency.id,
            type: this.widgetData.selectedFrequency.type,
            quantity: this.quantity,
            pricingModel: this.widgetData.selectedFrequency.pricingModel
          });
        });
    }
    if (!this.options.showSubscribeNow) {
      this.toggleBlock('#cb-checkout', true);
    } else {
      // Add event handler for Subscribe now
      document
        .querySelector('#cb-checkout')
        .addEventListener('click', (e) => this.subscribeNow(e));
    }
  },
  retrieveData: async function () {
    let error = null;
    // Fetch Variant, Plans, Charges info
    const [product, variants, subscriptionPlans, oneTimeCharges] =
      await Promise.all([
        this.fetchCBApi('/api/product?product_id=' + this.options.product_id),
        this.fetchCBApi('/api/variants?product_id=' + this.options.product_id),
        this.fetchCBApi(
          '/api/fetch-items?product_id=' +
            this.options.product_id +
            '&type=plan'
        ),
        this.fetchCBApi(
          '/api/fetch-items?product_id=' +
            this.options.product_id +
            '&type=charge'
        )
      ]).catch((err) => {
        // Show Error message on the widget
        this.showError();
        console.error(err);
        error = err;
      });
    this.productName = product.name;
    // Fetch Subscription price and one time prices
    const [subscriptionPrices, oneTimePrices] = await Promise.all([
      this.fetchCBApi('/api/fetch-item-prices?item_id=' + subscriptionPlans.id),
      this.fetchCBApi('/api/fetch-item-prices?item_id=' + oneTimeCharges.id)
    ]).catch((err) => {
      // Show Error message on the widget
      this.showError();
      console.log(err);
      error = err;
    });
    if (error) {
      return;
    }
    // Hide loading message and display the Widget content
    this.inited = true;
    this.selectors.loadingContainer.style.display = 'none';
    this.selectors.loadedContainer.style.display = 'block';
    // Populate the fetched data into the appropriate placeholders for easy reference
    this.variants = variants.list;
    this.prices.subscriptionPrices = subscriptionPrices;
    this.prices.oneTimePrices = oneTimePrices;
  },
  constructWidgetData: function () {
    this.variants.forEach((variant) => {
      this.widgetData[variant.id] = {
        ...variant,
        oneTimePrices: this.prices.oneTimePrices[variant.id],
        subscriptionPrices: this.prices.subscriptionPrices[variant.id]
      };
    });
  },
  renderWidget: function () {
    // Construct Variant Selector
    this.selectors.variantSelector.innerHTML = '';
    // Filter the variants that have atleast one price configured
    const filteredVariants = Object.keys(this.widgetData).filter(
      (variantId) => {
        const variant = this.widgetData[variantId];
        return (
          variant.oneTimePrices?.length || variant.subscriptionPrices?.length
        );
      }
    );
    // If the variant selector is configured as Select, Create Select containers
    if (this.options.variantSelector === 'select') {
      const select = document.createElement('select');
      select.classList = ['cb-variant-select'];
      this.selectors.variantSelector.appendChild(select);
      // Each Variants have unique set of Frequency prices, Change frequencies whenever Variant is changed
      select.addEventListener('change', (e) => {
        this.populateFrequencies(e);
      });
    }
    filteredVariants.forEach((variantId, index) => {
      const variant = this.widgetData[variantId];
      // Create button containers if the variant selector is configured as Buttons
      if (this.options.variantSelector === 'button') {
        const button = document.createElement('button');
        button.value = variant.id;
        button.textContent = variant.name;
        if (index === 0) {
          button.className = 'active';
        }
        this.selectors.variantSelector.appendChild(button);
        // Each Variants have unique set of Frequency prices, Change frequencies whenever Variant is changed
        button.addEventListener('click', (e) => {
          this.populateFrequencies(e);
        });
      } else {
        const option = document.createElement('option');
        option.value = variant.id;
        option.textContent = variant.name;
        document
          .getElementsByClassName('cb-variant-select')[0]
          .appendChild(option);
      }
    });
  },
  populateFrequencies: function (e) {
    // Get the Variant Id
    const variantId = e.target.value;
    // Toggle the active class to highlight the selected Variant in the UI
    if (this.options.variantSelector === 'button') {
      document.querySelector('.cb-variant-select-wrapper .active').className =
        '';
      e.target.className = 'active';
    }
    const frequencySelector = document.querySelector('#cb-frequency');
    let frequencies = [];
    // Check if there are One time prices and populate them first
    const oneTime = this.widgetData[variantId].oneTimePrices?.find((price) => {
      return price.currency_code === this.options.currency;
    });
    if (oneTime) {
      frequencies.push(oneTime);
    }
    // Check if there are Subscription prices and populate them
    const subscriptions = this.widgetData[variantId].subscriptionPrices?.filter(
      (price) => {
        return price.currency_code === this.options.currency;
      }
    );
    if (subscriptions?.length) {
      frequencies = [...frequencies, ...subscriptions];
    }
    frequencySelector.innerHTML = '';
    // After populating the prices and frequencies, build the Frequency selector
    frequencies.forEach((frequency) => {
      const option = document.createElement('option');
      option.value = frequency.id;
      option.dataset.itemId = frequency.item_id;
      option.dataset.pricingModel = frequency.pricing_model;
      // Construct frequency text
      let frequencyText = '';
      if (frequency.period === 1) {
        frequencyText = `Every ${frequency.period_unit}`;
      } else {
        frequencyText = `Every ${frequency.period} ${frequency.period_unit}s`;
      }
      option.textContent = `${
        frequency.period_unit ? frequencyText : 'One Time'
      } - ${frequency.currency_code} ${(frequency.price / 100).toFixed(2)}`;
      // Construct Shipping text
      let shippingText = '';
      if (frequency.shipping_period) {
        shippingText = `Delivers every ${
          frequency.shipping_period === 1 ? '' : frequency.shipping_period
        } `;
        shippingText = `${shippingText.trim()} ${
          frequency.shipping_period_unit
        }${frequency.shipping_period === 1 ? '' : 's'}`;
      }
      option.dataset.description = `<div class="cb-delivery-interval">${shippingText}</div>${
        frequency.description || ''
      }`;
      frequencySelector.appendChild(option);
    });
    frequencySelector.addEventListener('change', (e) => {
      this.changeFrequency(e);
    });
    document.querySelector('#cb-frequency').dispatchEvent(new Event('change'));
  },
  changeFrequency: function (e) {
    const pricingModel = document.querySelector(
      '#cb-frequency [value="' + e.target.value + '"]'
    )?.dataset?.pricingModel;
    this.widgetData.selectedFrequency = {
      id: e.target.value,
      itemId: document.querySelector(
        '#cb-frequency [value="' + e.target.value + '"]'
      )?.dataset?.itemId,
      type: e.target.value?.endsWith(`-charge-${this.options.currency}`)
        ? 'charge'
        : 'plan',
      pricingModel
    };
    const subsDescription = document.querySelector('.cb-subs-description');
    subsDescription.innerHTML = '';
    let desc = document.querySelector(
      '#cb-frequency [value="' + e.target.value + '"]'
    )?.dataset?.description;
    subsDescription.innerHTML = desc ? desc : '';
    if (pricingModel === 'flat_fee') {
      document.querySelector('.cb-quantity').style = 'visibility: hidden';
    } else {
      document.querySelector('.cb-quantity').style = 'visibility: visible';
    }
  },
  subscribeNow: async function (e) {
    e.preventDefault();
    let url = `/api/generate_checkout_new_url?subscription_items[item_price_id][0]=${this.widgetData.selectedFrequency.id}&customer[id]=${this.options.customer_id}&currency_code=${this.options.currency}&item_type=${this.widgetData.selectedFrequency.type}`;
    if (this.widgetData.selectedFrequency.type !== 'flat_fee') {
      url = `${url}&subscription_items[quantity][0]=${this.quantity}`;
    }
    try {
      const checkout = await this.fetchCBApi(url, {
        method: 'POST'
      });
      window.location.href = checkout.url;
    } catch (e) {
      console.error(e);
    }
  },
  quantityModifier: function (count) {
    if (this.quantity + count > 0) {
      this.quantity = this.quantity + count;
      document.querySelector('#cb-quantity-input').innerHTML = this.quantity;
    }
  },
  toggleBlock: function (selector, isHide) {
    if (!document.querySelector(selector)) {
      return;
    }
    document.querySelector(selector).style = isHide
      ? 'display: none'
      : 'display: block';
  },
  showError: function () {
    this.selectors.loadingContainer.innerHTML =
      'Sorry, Something went wrong. Try reloading the page.';
  }
};
CbWidget.init({
  customer_id: 'aras_shaffer', // Replace with Customer id
  product_id: 'Iphone-15', // Replace with product id
  variantSelector: 'select', // select/button
  currency: 'USD' // 'USD', 'EUR', etc.,
});
