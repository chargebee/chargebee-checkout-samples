var cbInstance
var openCheckout
var plans = []
var paymentIntent = null

function showWizard(id) {
  $('.ex-wiz__item').each((i, el) => el.classList.remove('is-active'))
  $(`#wizard-${id}`).addClass('is-active');

  $('form').each((i, el) => el.classList.add('hidden'));
  $(`#${id}-form`).removeClass('hidden');
}

/* 
  AdditionalData improves the chances of performing a frictionless checkout
  Get Billing address details 
*/
function getAdditionalData() {
  const data = {
    billingAddress: {}
  };
  $('#billing-form input').each((i, el) => {
    if(el.name !== 'email')
      data.billingAddress[el.name] = el.value;
    else data[el.name] = el.value
  })

  return data;
}

function initializeUI() {

  $("input").on("focus", function () {
    $(this).addClass("focus");
  });

  $("input").on("change", function (e) {
    e.target.classList.toggle('filled', !!e.target.value);
  });

  $("input").on("blur", function () {
    $(this).removeClass("focus");
  });

  showWizard('billing');

  $(".ex2-order__item").on('click', function (e) {
    $('.ex2-order__item').each((i, el) => {
      el.classList.remove('is-active');
    })

    $(this).addClass('is-active');
    const selectedPlan = $(this).data("cbplan");
    console.log('selectedPlan', selectedPlan)
    $('#plan').val(selectedPlan).trigger('change');
  });

  $('#billing-button').on('click', function (e) {
    e.preventDefault();
    showWizard('payment');
  });

  $('.back-to-billing').on('click', function (e) {
    e.preventDefault();
    showWizard('billing');
  });

}

function successUI(token) {
  $("#submit-button").removeClass("submit");
  $("#token").show();
  $("#error").hide();
  $("#token").html(token);
  showWizard('success');
  $('#plan-details').toggleClass('hidden', true)

  $('#success-form').html(`
    <h3>Payment success. Creating a subscription..</h3>
    <br>
    <img src="data:image/svg+xml;base64,PHN2ZyBjbGFzcz0ic3ZnLWxvYWRlciIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iNTUiIGhlaWdodD0iNTUiIHZpZXdCb3g9IjAgMCA4MCA4MCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTQwIDcyQzIyLjQgNzIgOCA1Ny42IDggNDBTMjIuNCA4IDQwIDhzMzIgMTQuNCAzMiAzMmMwIDEuMS0uOSAyLTIgMnMtMi0uOS0yLTJjMC0xNS40LTEyLjYtMjgtMjgtMjhTMTIgMjQuNiAxMiA0MHMxMi42IDI4IDI4IDI4YzEuMSAwIDIgLjkgMiAycy0uOSAyLTIgMnoiPjxhbmltYXRlVHJhbnNmb3JtIGF0dHJpYnV0ZVR5cGU9InhtbCIgYXR0cmlidXRlTmFtZT0idHJhbnNmb3JtIiB0eXBlPSJyb3RhdGUiIGZyb209IjAgNDAgNDAiIHRvPSIzNjAgNDAgNDAiIGR1cj0iMC42cyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiLz48L3BhdGg+PC9zdmc+" class="loading-icon"></img>
  `);
}

function errorUI() {
  $("#submit-button").removeClass("submit");
  // TODO get a proper error message
  $("#error").show();
  $("#error").html("<h3>Problem while tokenizing your card details<h3>");
  $("#token").hide();
}

$(document).ready(function () {
  // Initialize a Chargebee instance after mounting the root component.
  Chargebee.init({
    site: "honeycomics-v3-test",
    publishableKey: "test_qoH22RugUvm5IcxoqUD5Svdcu9mX5figf"
  })

  initializeUI()

  // Options for Card Component
  var options = cardComponentOptions;

  // You can access the above created instance anywhere using the following code
  cbInstance = Chargebee.getInstance();

  // Load 'components' module before creating card component
  cbInstance.load("components").then(() => {

    // Create card component
    var cardComponent = cbInstance.createComponent("card", options);

    // Create card fields
    cardComponent.createField("number").at("#card-number");
    cardComponent.createField("expiry").at("#card-expiry");
    cardComponent.createField("cvv").at("#card-cvc");

    // Mount card component
    cardComponent.mount();

    // Form submit handler
    $("#payment-form").on("submit", function (event) {
      $("#submit-button").addClass("submit");
      event.preventDefault();

      // Collect the billing details from checkout form
      const additionalData = getAdditionalData();

      console.log('Billing Details', additionalData.billingAddress);

      // Initiate 3DS Authorization, pass the paymentIntent and additional info as argument
      /* Note: Ensure to have created a paymentIntent before executing this method */
      cardComponent.authorizeWith3ds(paymentIntent, additionalData).then(authorizedIntent => {

        successUI(authorizedIntent.id)

        const selectedPlan = getSelectedPlan()
        console.log(`creating a subscription for ${selectedPlan}`);

        // Call create subscription API
        createSubscription(authorizedIntent).then(data => {
          console.log('Successfully subscribed', data)
          const plan = data.subscription.plan_id;
          const planName = getPlanName(plan);
          $('#success-form').html(`<h3>Thank you for subscribing to ${planName}</h3>`);
          return data;
        })

      }).catch(error => {
        console.error(error);
        errorUI()
      });
    });
  });
});

function getSelectedPlan() {
  let selectedPlan = $("#plan").val();
  if (!selectedPlan) {
    $("#plan").val(plans[0].id);
    selectedPlan = plans[0].id
  }
  return selectedPlan
}

function getPlanPrice(planId) {
  return plans.find(_plan => _plan.id === planId).price
}

function getPlanName(planId) {
  return plans.find(_plan => _plan.id === planId).name
}

function setPlanPrice(price) {
  Array.from(document.getElementsByName('plan-price')).map(function (el) {
    const text = `$${(price / 100).toFixed(2)} USD`;
    el.innerText = text;
  });
}

function getAllPlans() {
  return fetch("http://localhost:4000/plans", {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: "GET",
  }).then(response => response.json())
}

function populatePlans() {
  const select = document.getElementById('plan')
  plans.map(plan => {
    const option = document.createElement('option')
    option.value = plan.id;
    option.innerHTML = plan.name
    select.appendChild(option);
  })
}

function createSubscription(intent) {
  const payload = {
    planId: getSelectedPlan(),
    email: 'johndoe@example.com',
    paymentIntentId: intent.id,
  }
  return fetch('http://localhost:4000/create_subscription_payment_intent', {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify(payload)
  }).then(response => response.json())
}

function createPaymentIntent (payload = {}) {
  return fetch("http://localhost:4000/payment_intent", {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }, 
    method: "POST", 
    body: JSON.stringify(payload)
  }).then(response => response.json())
  .then(intent => {
    paymentIntent = intent;
    return intent;
  })
}

/*
  Populate available active plans
  Create a payment intent on page load
*/
getAllPlans().then(planList => {
  plans = planList.list.map(planObj => planObj.plan)
  // Populate plans
  populatePlans()

  var selectedPlan = getSelectedPlan();
  var planPrice = getPlanPrice(selectedPlan);
  setPlanPrice(planPrice);
  createPaymentIntent({ amount: planPrice })
})

function selectOnChange(event) {
  selectedPlan = getSelectedPlan();
  planPrice = getPlanPrice(selectedPlan)
  // Recreate/update the paymentIntent as the plan price changes
  createPaymentIntent({ amount: planPrice })
  setPlanPrice(planPrice);
}

$('#plan').change(selectOnChange)
