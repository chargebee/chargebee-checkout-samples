var menu = {
  'adyen': {
    key: "adyen",
    name: "Adyen",
    subMenu: {
      element: { key: "element", name: "Using Element" },
      card: { key: "card", name: "Using Card" }
    }
  },
  'chargebee-test': {
    key: "chargebee-test",
    name: "Chargebee Test",
    subMenu: {
      card: { key: "card", name: "Using Card" }
    }
  }
};

var paths = window.location.pathname.split("/").filter(dir => dir);
var subCategory = paths.pop();
var category =  paths.pop(); 

var activeCategory = menu[category];
var activeSubCategory = activeCategory.subMenu[subCategory];

var menuHTML = document.createElement('div')
menuHTML.innerHTML = `
<div class="ch-menu">
  <div class="ch-nav">   
      <div class="ch-nav__aide">
          <label class="ch-select">
              <span class="ch-select__label">Gateway with</span>
              <select class="ch-select__control" id="category-chooser">
                  ${Object.keys(menu).map(key => `<option value="${key}" ${activeCategory.key == key ? "selected": ""}>${menu[key].name}</option>`).join("")}
              </select>
          </label>        
      </div>
      <div class="ch-nav__main">
        ${Object.keys(activeCategory.subMenu).map(key => `<a id="${key}" class="ch-nav__item ${activeSubCategory.key == key ? "ch-nav__item--active": ""}" href="javascript:void(0)">${activeCategory.subMenu[key].name}</a>`).join("")}
      </div>
      <div class="ch-nav__mobile">
        <label class="ch-select">
            <span class="ch-select__label">Implementation</span>
            <select class="ch-select__control" id="sub-category-chooser">
            ${Object.keys(activeCategory.subMenu).map(key => `<option value="${key}" ${activeSubCategory.key == key ? "selected": ""}>${activeCategory.subMenu[key].name}</option>`).join("")}
            </select>
        </label>
      </div>
  </div>
</div>`;
document.body.appendChild(menuHTML);

var source = document.createElement('div')
source.classList.add('view-source')
source.innerHTML = `  
  <div id="source-contents">
    <ul>
      <li>Initializing chargebee.js</li>
      <li>Setting up payment intent</li>
      <li>Handle card payment</li>
    </ul>
  </div>
  <br>
  <a id="source-link" href="${gitHubLink()}" target="_blank">
    View Source
  </a>
`
document.body.appendChild(source);

function gitHubLink() {
  return `https://github.com/chargebee/chargebee-checkout-samples/tree/master/3ds-samples/${activeCategory.key}/${activeSubCategory.key}#readme`
}

Array.from(document.querySelectorAll('.ch-nav__item')).map(a => {
  a.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector('.ch-nav__item--active').classList.remove('ch-nav__item--active');
    setActive(e.target);
    loadExample(activeCategory, activeCategory.subMenu[e.target.id]);
    return false;
  })
});

function setActive(el) {
  el.classList.add('ch-nav__item--active');
}

document.getElementById("category-chooser").addEventListener('change', function(e) {
  loadExample(menu[e.target.value], Object.values(menu[e.target.value].subMenu)[0]);
});

function loadExample(newCategory, newSubCategory) {
  var url = `${window.location.origin}/3ds-examples/${newCategory.key}/${newSubCategory.key}/`;
  window.location.replace(url);
}

document.getElementById("sub-category-chooser").addEventListener('change', function(e) {
  let newSubCategoryId = document.getElementById("sub-category-chooser").value;
  document.getElementById(newSubCategoryId).click();
});

document.addEventListener('DOMContentLoaded', function() {

  var cc_number = document.getElementById('cc-number');
  var cc_month = document.getElementById('cc-month');
  var cc_year = document.getElementById('cc-year');
  var cc_cvv = document.getElementById('cc-cvv');

  if(cc_number && cc_month && cc_year && cc_cvv) {
    cc_number.onkeypress = digitOnly;
    cc_number.oninput = function() {
      this.value = cc_number_format(this.value)
    }
    cc_month.onkeypress = function(e) {
      return digitOnly(e, 2);
    };
    cc_year.onkeypress = function(e) {
      return digitOnly(e, 4);
    };
    cc_cvv.onkeypress = function(e) {
      return digitOnly(e, 4);
    };
  }

})

function digitOnly(event, max) {
  var code = (event.which) ? event.which : event.keyCode;
  if ((code < 48 || code > 57) && (code > 31)) {
      return false;
  }
  if(max && max <= event.target.value.length) {
    return false;
  }
  return true;
}

function cc_number_format(value) {
  var v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
  var matches = v.match(/\d{4,16}/g);
  var match = matches && matches[0] || ''
  var parts = []
  for (i=0, len=match.length; i<len; i+=4) {
    parts.push(match.substring(i, i+4))
  }
  if (parts.length) {
    return parts.join(' ')
  } else {
    return value
  }
}

function createPaymentIntent(payload) {
  return fetch("http://localhost:4000/payment_intent", {
  headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
  }, 
  method: "POST", 
  body: JSON.stringify(payload)
  }).then((response => response.json()));
}

function getAdyenOriginKey() {
  return fetch("http://localhost:4000/adyen-origin-key", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ origin: window.location.origin })
  }).then((response) => response.json())
  .then((response) => {
    const key = response.originKeys[Object.keys(response.originKeys)[0]]
    return key;
  })
}