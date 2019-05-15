$(document).ready(function() {

  $("input").on("focus", function() {
    $(this).addClass("focus");
  });

  $("input").on("blur", function() {
    $(this).removeClass("focus");
  });

  $("input").on("keyup", function() {
    if($(this).val()) {
      $(this).removeClass("empty");
      $(this).addClass("val");
    }
    else {
      $(this).addClass("empty");
      $(this).removeClass("val");
    }
  });
  var cardIcon = true;
  var cbInstance = Chargebee.init({
    site: "honeycomics-v3-test",
    publishableKey: "test_qoH22RugUvm5IcxoqUD5Svdcu9mX5figf"
  });

  var options = {
    fonts: [
      'https://fonts.googleapis.com/css?family=Lato:300,500,600'
    ],
    icon: cardIcon,
    locale: "en",
    classes: {
      focus: 'focus',
      invalid: 'invalid',
      empty: 'empty',
      complete: 'complete',
    },
    style: getIframeStyles(themes[0]),
  }

  function getIframeStyles(theme) {
    return {
      base: {
        color: theme['main-text'],
        fontWeight: '500',
        fontFamily: 'Lato,-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica Neue, sans-serif',
        fontSize: '16px',
        fontSmoothing: 'antialiased',
        iconColor: theme['main-text'],

        ':focus': {
          // color: '#424770',
        },

        '::placeholder': {
          color: theme['placeholder'],
        },

        ':focus::placeholder': {
          color: theme['placeholder-focused'],
        },
      },
      invalid: {
        color: theme['invalid'] || '#FF7C4A',

        ':focus': {
          color: theme['invalid-focused'] || '#e44d5f',
        },
        '::placeholder': {
          color: theme['invalid-placeholder'] || '#FFCCA5',
        },
      },
    }
  }

  function setTheme(index) {
    const theme = themes[index];
    const root = document.documentElement;
    root.style.setProperty('--main-bg', theme['main-bg'])
    root.style.setProperty('--secondary-bg', theme['secondary-bg'])
    root.style.setProperty('--main-text', theme['main-text'])
    root.style.setProperty('--placeholder', theme['placeholder'])
    root.style.setProperty('--placeholder-focused', theme['placeholder-focused'])
    root.style.setProperty('--primary-btn', theme['primary-btn'])
    root.style.setProperty('--btn-text', theme['btn-text'])
    root.style.setProperty('--primary-btn-focus', theme['primary-btn-focus'])

    cardComponent.update({
      style: getIframeStyles(theme)
    });
  }

  function toggleCardIcon() {
    cardIcon = !cardIcon;
    cardComponent.update({
      icon: cardIcon
    });
  }

  var counter = 0;
  function changePlaceholder() {
    counter++;
    const placeholder = [
      {
        number: 'Card number',
        cvv: 'CVV',
        expiry: 'MM/YY'
      },
      {
        number: '4111 1111 1111 1111',
        cvv: '123',
        expiry: 'MM / YY'
      }
    ]
    cardComponent.update({
      placeholder: placeholder[counter%2]
    })
  }

  var cardComponent;
  cbInstance.load("components").then(() => {
    cardComponent = cbInstance.createComponent("card", options).at("#card-combined");

    // Automatically focus on card fields 
    cardComponent.on('ready', function() {
      cardComponent.focus();
    })

    // Mount card component
    cardComponent.mount();
    
    $("#clear-button").on("click", function(event) {
      event.preventDefault();
      // Clear card field contents
      cardComponent.clear();
    });

    $("#payment").on("submit", function(event) {
      $("#tokenize").addClass("submit");
      event.preventDefault();
      cardComponent.tokenize().then(data => {
        $("#tokenize").removeClass("submit");
        $("#token").show();
        $("#error").hide();
        $("#token").html(data.token);
      }).catch(error => {
        $("#tokenize").removeClass("submit");
        // TODO get a proper error message
        $("#error").show();
        $("#error").html("Problem while tokenizing your card details");
        $("#token").hide();
        console.log(error);
      });
    });

    $('#theme-1').on('click', function(event) {
      event.preventDefault();
      setTheme(0)
    })
    $('#theme-2').on('click', function(event) {
      event.preventDefault();
      setTheme(1)
    })
    $('#theme-3').on('click', function(event) {
      event.preventDefault();
      setTheme(2)
    })
    $('#theme-4').on('click', function(event) {
      event.preventDefault();
      setTheme(3)
    })
    $('#toggle-icon').on('click', function(event) {
      event.preventDefault();
      toggleCardIcon();
    })
    $('#change-placeholder').on('click', function(event) {
      event.preventDefault();
      changePlaceholder();
    })
    $('#focus-field').on('click', function(event) {
      event.preventDefault();
      cardComponent.focus();
    })

  });
});

const themes = [
  {
    'main-bg': '#262E3A',
    'secondary-bg': '#3e4b5b',
    'main-text': '#fff',
    'placeholder': '#939aa3',
    'placeholder-focused': '#ccc',
    'primary-btn': '#6EEDB6',
    'btn-text': '#1C2026',
    'primary-btn-focus': 'rgb(70, 203, 145)',
    'invalid': '#FF7C4A',
    'invalid-focused': '#e44d5f',
    'invalid-placeholder': '#FFCCA5',
  },
  {
    'main-bg': '#D5DBE7',
    'secondary-bg': '#fff',
    'main-text': '#000',
    'placeholder': '#abacbe',
    'placeholder-focused': '#abacbe',
    'primary-btn': '#4773D2',
    'btn-text': '#fff',
    'primary-btn-focus': '#3361c3',
    'invalid': '#E94745',
    'invalid-focused': '#e44d5f',
    'invalid-placeholder': '#FFCCA5'
  },
  {
    'main-bg': '#fca571',
    'secondary-bg': '#fff',
    'main-text': '#252857',
    'placeholder': '#9293AB',
    'placeholder-focused': '#666',
    'primary-btn': '#252857',
    'btn-text': '#fff',
    'primary-btn-focus': '#191c4a',
    'invalid': '#E94745',
    'invalid-focused': '#e44d5f',
    'invalid-placeholder': '#FFCCA5'
  },
  {
    'main-bg': '#544FB0',
    'secondary-bg': '#fff',
    'main-text': '#35A9BD',
    'placeholder': 'ddd',
    'placeholder-focused': '#ddd',
    'primary-btn': '#35A9BD',
    'btn-text': '#fff',
    'primary-btn-focus': 'rgb(29, 138, 157)',
  }
]