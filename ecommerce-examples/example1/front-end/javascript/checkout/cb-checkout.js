const cbInstance = Chargebee.init({
  site: 'SITENAME',
  publishableKey: 'PUBSHIABLE_APIKEY'
});

const CbCheckout = {
  options: {},
  customer: {},
  cart: {},
  cardComponent: null,
  token: '',
  estimates: {},
  init: async function (info = {}) {
    this.options = {
      ...info
    };
    this.populateCountries();
    document
      .querySelector('.cb-checkout-form')
      .addEventListener('submit', (e) => {
        CbCheckout.proceedToCheckout(e, this);
      });
    this.cart = JSON.parse(window.localStorage.getItem('CbCart') || '{}');
    await this.populateOrderSummary();
    this.initializeCard();
    if (this.options.customerId) {
      await this.retrieveCustomer();
    }
    document
      .querySelector('[name=same_shipping]')
      ?.addEventListener('change', (e) => {
        CbCheckout.toggleSameAddress(e);
      });
    document.querySelector('#add-new-card').addEventListener('click', (e) => {
      e.preventDefault();
      CbCheckout.toggleCard();
    });
    document.querySelector('#existing-card').addEventListener('click', (e) => {
      e.preventDefault();
      CbCheckout.toggleCard('existing');
    });
  },
  toggleSameAddress: function (e) {
    const isSameAddress = e.target.checked,
      container = document.querySelector('.cb-shipping-wrapper');
    if (isSameAddress) {
      container.className = 'cb-shipping-wrapper cb-hide';
      document.querySelector('[name=line1]').removeAttribute('required');
      document.querySelector('[name=city]').removeAttribute('required');
      document.querySelector('[name=zip]').removeAttribute('required');
      document.querySelector('[name=country]').removeAttribute('required');
    } else {
      container.className = 'cb-shipping-wrapper';
      document.querySelector('[name=line1]').setAttribute('required', '');
      document.querySelector('[name=city]').setAttribute('required', '');
      document.querySelector('[name=zip]').setAttribute('required', '');
      document.querySelector('[name=country]').setAttribute('required', '');
    }
  },
  proceedToCheckout: async function (e, context) {
    e.preventDefault();
    var token = '';
    if (this.customer?.useCard !== 'existing') {
      const isValidCard = await this.cardComponent.validateCardDetails();
      if (!isValidCard?.isValid) {
        return;
      } else {
        const data = await this.cardComponent.tokenize();
        token = data.token;
      }
    }
    let query = '';
    context.cart.products.forEach((product, index) => {
      query = `${query}purchase_items[index][${index}]=${
        index + 1
      }&purchase_items[item_price_id][${index}]=${
        product.items[0].item_price_id
      }&`;
      if (product.data.pricingModel !== 'flat_fee') {
        query = `${query}purchase_items[quantity][${index}]=${product.planQuantity}&`;
      }
    });
    const billing = {
      firstName: document.querySelector('.cb-checkout-form [name=firstName]')
        .value,
      lastName: document.querySelector('.cb-checkout-form [name=lastName]')
        .value,
      email: document.querySelector('.cb-checkout-form [name=email]').value,
      line1: document.querySelector('.cb-billing-wrapper [name=billing_line1]')
        .value,
      line2:
        document.querySelector('.cb-billing-wrapper [name=billing_line2]')
          .value || '',
      city: document.querySelector('.cb-billing-wrapper [name=billing_city]')
        .value,
      zip: document.querySelector('.cb-billing-wrapper [name=billing_zip]')
        .value,
      country: document.querySelector(
        '.cb-billing-wrapper [name=billing_country]'
      ).value
    };
    const formData = document.querySelector('[name=same_shipping]').checked
      ? billing
      : {
          firstName: document.querySelector(
            '.cb-checkout-form [name=firstName]'
          ).value,
          lastName: document.querySelector('.cb-checkout-form [name=lastName]')
            .value,
          email: document.querySelector('.cb-checkout-form [name=email]').value,
          line1: document.querySelector('.cb-checkout-form [name=line1]').value,
          line2:
            document.querySelector('.cb-checkout-form [name=line2]').value ||
            '',
          city: document.querySelector('.cb-checkout-form [name=city]').value,
          zip: document.querySelector('.cb-checkout-form [name=zip]').value,
          country: document.querySelector('.cb-checkout-form [name=country]')
            .value
        };

    query = `${query}customer_id=${context.options.customerId}&shipping_addresses[first_name][0]=${formData.firstName}&shipping_addresses[last_name][0]=${formData.lastName}&shipping_addresses[email][0]=${formData.email}&shipping_addresses[line1][0]=${formData.line1}&shipping_addresses[line2][0]=${formData.line2}&shipping_addresses[city][0]=${formData.city}&shipping_addresses[zip][0]=${formData.zip}&shipping_addresses[country][0]=${formData.country}&billing_address[first_name]=${billing.firstName}&billing_address[last_name]=${billing.lastName}&billing_address[email]=${billing.email}&billing_address[line1]=${billing.line1}&billing_address[line2]=${billing.line2}&billing_address[city]=${billing.city}&billing_address[zip]=${billing.zip}&billing_address[country]=${billing.country}&token_id=${token}`;
    try {
      const res = await fetch(`/api/purchase?${query}`, {
        method: 'POST'
      });
      const response = await res.json();
      if (response?.purchase?.id) {
        // Redirect to Success page
        alert('Your purchase is completed!');
        localStorage.removeItem('CbCart');
      } else if (response.error_code) {
        throw Error(response.message);
      }
    } catch (err) {
      console.error(err);
      document.querySelector('.error-container').className = 'error-container';
      document.querySelector('.error-container').innerText = err;
    }
  },
  populateOrderSummary: async function () {
    const products = this.cart.products || [];
    products.forEach((product, index) => {
      this.renderProductInOrderSummary(product);
    });
    await this.calculateEstimate();
  },
  renderProductInOrderSummary: function (product) {
    const template = `
      <div class="cb-product-name">
        ${product.data.productName} - ${product.data.variantName}
        <br />
        Qty: ${product.planQuantity}
        <br />
        ${product.data.deliveryInfo || 'Delivers one time'}
      </div>
      <div class="cb-product-price">
        ${(product.data.unitPrice * product.planQuantity).toFixed(2)} ${
        product.data.currencyCode
      }
      </div>
    `,
      productRow = document.createElement('div');
    productRow.className = 'cb-product-row';
    productRow.innerHTML = template;
    document.querySelector('.cb-product-list').appendChild(productRow);
  },
  calculateEstimate: async function () {
    let query = '';
    this.cart.products.forEach((product, index) => {
      query = `${query}purchase_items[index][${index}]=${
        index + 1
      }&purchase_items[item_price_id][${index}]=${
        product.items[0].item_price_id
      }&`;
      query = `${query}purchase_items[quantity][${index}]=${product.planQuantity}&`;
    });
    try {
      const res = await fetch(`/api/calculate_estimates?${query}`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
        }
      });
      const estimates = await res.json();
      this.estimates = estimates;
      document.querySelector('.cb-total-display').innerText = `${(
        estimates.amount_due / 100
      ).toFixed(2)} ${estimates.currency_code}`;
    } catch (err) {
      console.error(err);
    }
  },
  retrieveCustomer: async function () {
    const res = await fetch(
      '/api/fetch_customer?customer_id=' + this.options.customerId
    );
    this.customer = await res.json();
    this.toggleCard(!!this.customer.payment_source ? 'existing' : 'new');
    this.populateFields();
  },
  populateFields: function () {
    const billing = this.customer.billing_address || {};
    document.querySelector('[name=firstName').value =
      this.customer.first_name || '';
    document.querySelector('[name=lastName').value =
      this.customer.last_name || '';
    document.querySelector('[name=email').value = this.customer.email || '';
    document.querySelector('[name=billing_line1').value = billing.line1 || '';
    document.querySelector('[name=billing_line2').value = billing.line2 || '';
    document.querySelector('[name=billing_city').value = billing.city || '';
    document.querySelector('[name=billing_zip').value = billing.zip || '';
    document.querySelector('[name=billing_country').value =
      billing.country || '';
  },
  toggleCard: function (action = 'new') {
    this.customer.useCard = action;
    if (!this.customer.payment_source) {
      document.querySelector('#existing-card').className = 'cb-hide';
    } else {
      document.querySelector('#existing-card').className =
        'cb-cta-button cb-cta-secondary-button';
    }
    if (action !== 'new' && !!this.customer.payment_source) {
      const card = this.customer.payment_source.card;
      document.querySelector('.cb-card-info .cb-existing-card').className =
        'cb-existing-card';
      document.querySelector('.cb-card-info .ex1-fieldset').className =
        'ex1-fieldset cb-hide';
      document.querySelector(
        '.cb-card-number'
      ).innerText = `${card.brand} ending ${card.last4}`;
      document.querySelector(
        '.cb-expiry-details'
      ).innerText = `Expires on ${card.expiry_month}/${card.expiry_year}`;
    } else if (action === 'new') {
      document.querySelector('.cb-card-info .ex1-fieldset').className =
        'ex1-fieldset';
      document.querySelector('.cb-card-info .cb-existing-card').className =
        'cb-existing-card cb-hide';
    }
  },
  populateCountries: function () {
    const selectElement = document.querySelector(
      '.cb-shipping-info [name=country]'
    );
    const billingSelectElement = document.querySelector(
      '.cb-billing-info [name=billing_country]'
    );
    CbCountries.forEach((country) => {
      const option = document.createElement('option');
      option.value = country.Code;
      option.textContent = country.Name;
      billingSelectElement.appendChild(option);
      selectElement.appendChild(option.cloneNode(true));
    });
  },
  initializeCard: function () {
    var options = {
      fonts: ['https://fonts.googleapis.com/css?family=Roboto:300,500,600'],

      // add classes for different states
      classes: {
        focus: 'focus',
        invalid: 'invalid',
        empty: 'empty',
        complete: 'complete'
      },

      // add placeholders
      placeholder: {
        number: '4111 1111 1111 1111'
      },

      // Set locale
      locale: 'en',

      style: {
        // Styles for default state
        base: {
          color: '#333',
          fontWeight: '500',
          fontFamily: 'Roboto, Segoe UI, Helvetica Neue, sans-serif',
          fontSize: '16px',
          fontSmoothing: 'antialiased',

          ':focus': {
            // color: '#424770',
          },

          '::placeholder': {
            color: '#abacbe'
          },

          ':focus::placeholder': {
            // color: '#7b808c',
          }
        },

        // Styles for invalid state
        invalid: {
          color: '#E94745',

          ':focus': {
            color: '#e44d5f'
          },
          '::placeholder': {
            color: '#FFCCA5'
          }
        }
      }
    };
    cbInstance.load('components').then(() => {
      // Mounting Card component
      this.cardComponent = cbInstance.createComponent('card', options);
      this.cardComponent.createField('number').at('#card-number');
      this.cardComponent.createField('expiry').at('#card-expiry');
      this.cardComponent.createField('cvv').at('#card-cvc');
      this.cardComponent.mount();
    });
  }
};

CbCheckout.init(
  // {
  //   customerId: 'CUST_ID'
  // }
);
