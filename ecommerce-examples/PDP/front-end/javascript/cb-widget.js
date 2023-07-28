// CbWidget contains all the logic required to build the Widget
const CbWidget = {
  inited: false,
  options: {
    site_id: '', // Mandatory field - Site ID
    customer_id: '', // Optional
    product_id: '', // Mandatory
    variantSelector: 'select', // button/select
    currency: 'USD', // Valid Currency Code
    showAddToCart: true, // Display Add to Cart in your widget
    showSubscribeNow: true // Display Subscribe now in your widget
  },
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
  fetchCBApi: async function (url) {
    const response = await fetch(url);
    return response.json();
  },
  // initialize CbWidget. Entry point to get started
  init: async function (options = {}) {
    // Override default options with the custom options
    this.options = {
      ...this.options,
      ...options
    };
    // Fetch APIs required to populate data in widgetData
    await this.retrieveData();
    // Use the data and options provided to construct the widget
    this.constructWidgetData();
    // Render the widget on the page
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
      .querySelector('.cb-decrement-btn')
      .addEventListener('click', () => this.quantityModifier(-1));
    document
      .querySelector('.cb-increment-btn')
      .addEventListener('click', () => this.quantityModifier(1));
    // Show blocks based on the options provided
    if (!this.options.showAddToCart) {
      this.toggleBlock('#cb-add-to-cart', true);
    }
    if (!this.options.showSubscribeNow) {
      this.toggleBlock('#cb-checkout', true);
    }
  },
  retrieveData: async function () {
    let error = null;
    const [variants, subscriptionPlans, oneTimeCharges] = await Promise.all([
      this.fetchCBApi('/api/variants?product_id=' + this.options.product_id),
      this.fetchCBApi(
        '/api/fetch-items?product_id=' + this.options.product_id + '&type=plan'
      ),
      this.fetchCBApi(
        '/api/fetch-items?product_id=' +
          this.options.product_id +
          '&type=charge'
      )
    ]).catch((err) => {
      this.showError();
      console.error(err);
      error = err;
    });
    const [subscriptionPrices, oneTimePrices] = await Promise.all([
      this.fetchCBApi('/api/fetch-item-prices?item_id=' + subscriptionPlans.id),
      this.fetchCBApi('/api/fetch-item-prices?item_id=' + oneTimeCharges.id)
    ]).catch((err) => {
      this.showError();
      console.log(err);
      error = err;
    });
    if (error) {
      return;
    }
    this.inited = true;
    this.selectors.loadingContainer.style.display = 'none';
    this.selectors.loadedContainer.style.display = 'block';
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
    this.selectors.variantSelector.innerHTML = '';
    const filteredVariants = Object.keys(this.widgetData).filter(
      (variantId) => {
        const variant = this.widgetData[variantId];
        return (
          variant.oneTimePrices?.length || variant.subscriptionPrices?.length
        );
      }
    );
    if (this.options.variantSelector === 'select') {
      const select = document.createElement('select');
      select.classList = ['cb-variant-select'];
      this.selectors.variantSelector.appendChild(select);
      select.addEventListener('change', (e) => {
        this.populateFrequencies(e);
      });
    }
    filteredVariants.forEach((variantId, index) => {
      const variant = this.widgetData[variantId];
      if (this.options.variantSelector === 'button') {
        const button = document.createElement('button');
        button.value = variant.id;
        button.textContent = variant.name;
        if (index === 0) {
          button.className = 'active';
        }
        this.selectors.variantSelector.appendChild(button);
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
    const variantId = e.target.value;
    if (this.options.variantSelector === 'button') {
      document.querySelector('.cb-variant-select-wrapper .active').className =
        '';
      e.target.className = 'active';
    }
    const frequencySelector = document.querySelector('#cb-frequency');
    let frequencies = [];
    const oneTime = this.widgetData[variantId].oneTimePrices?.find((price) => {
      return price.currency_code === this.options.currency;
    });
    if (oneTime) {
      frequencies.push(oneTime);
    }
    const subscriptions = this.widgetData[variantId].subscriptionPrices?.filter(
      (price) => {
        return price.currency_code === this.options.currency;
      }
    );
    if (subscriptions?.length) {
      frequencies = [...frequencies, ...subscriptions];
    }
    frequencySelector.innerHTML = '';
    frequencies.forEach((frequency) => {
      const option = document.createElement('option');
      option.value = frequency.id;
      option.textContent = `${frequency.period_unit || 'One Time'} - ${
        frequency.currency_code
      } ${(frequency.price / 100).toFixed(2)}`;
      option.dataset.description = frequency.description || '';
      frequencySelector.appendChild(option);
    });
    document.querySelector('#cb-checkout').dataset['cbItem-0'] =
      frequencies[0].id;
    document.querySelector(
      '#cb-checkout'
    ).href = `https://${this.options.site_id}.chargebee.com/hosted_pages/checkout?subscription_items[item_price_id][0]=${frequencies[0].id}&subscription_items[quantity][0]=${this.quantity}&layout=in_app`;
    frequencySelector.addEventListener('change', this.changeFrequency);
    document.querySelector('#cb-frequency').dispatchEvent(new Event('change'));
  },
  changeFrequency: function (e) {
    const subsDescription = document.querySelector('.cb-subs-description');
    subsDescription.innerHTML = '';
    const desc = document.querySelector(
      '#cb-frequency [value=' + e.target.value + ']'
    )?.dataset?.description;
    subsDescription.innerHTML = desc ? desc : '';
    document.querySelector(
      '#cb-checkout'
    ).href = `https://${this.options.site_id}.chargebee.com/hosted_pages/checkout?subscription_items[item_price_id][0]=${e.target.value}&subscription_items[quantity][0]=${this.quantity}&layout=in_app`;
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
  site_id: 'pc-pim-test',
  product_id: 'HRX-Shirt', //'PIM-UI-Release',
  variantSelector: 'select',
  currency: 'USD'
});
