<template>
  <div class="ex1 container">
    <div class="ex1-wrap">
    <div class="ex1-fieldset">
      <div class="ex1-field">                  
          <input class="ex1-input" :class="{'val': firstName}" type="text" placeholder="John Doe" v-model="firstName">
          <label class="ex1-label">Name on Card</label><i class="ex1-bar"></i>
      </div>
      <!-- Render card components in fields-mode -->
      <!-- Pass styles, classes, locale, placeholder, fonts as props -->
      <Provider :cbInstance="cbInstance">
        <CardComponent ref="card" class="fieldset field" 
          :styles="styles" 
          :classes="classes" 
          :locale="locale" 
          :placeholder="placeholder" 
          :fonts="fonts"
        >
          <div class="ex1-field">
            <!-- Card number field -->
            <CardNumber class="ex1-input" />
            <label class="ex1-label">Card Number</label><i class="ex1-bar"></i>
          </div>

          <div class="ex1-fields">
            <div class="ex1-field">
              <!-- Card expiry field -->
              <CardExpiry class="ex1-input"/>
              <label class="ex1-label">Expiry</label><i class="ex1-bar"></i>
            </div>

            <div class="ex1-field">
              <!-- Card cvv field -->
              <CardCvv class="ex1-input"/>
              <label class="ex1-label">CVC</label><i class="ex1-bar"></i>
            </div>

          </div>
        </CardComponent>
      </Provider>

    </div>
    <button type="submit" :class="{'submit': loading}" class="ex1-button" @click="tokenize">Pay $x & Tokenize</button>
    <div class="error" role="alert" v-if="error">{{error}}</div>
    <div class="token" v-if="token">{{token}}</div>
  </div>
  </div>
</template>

<script>
import { CardComponent, CardNumber, CardExpiry, CardCvv, Provider } from '@chargebee/chargebee-js-vue-wrapper';

export default {
  name: 'Example4',
  components: {
    CardComponent,
    CardNumber,
    CardExpiry,
    CardCvv,
    Provider,
  },
  methods: {
    tokenize() {
      this.loading = true;
      // Call the tokenize method using the card component's ref
      this.$refs.card.tokenize({}).then((data) => {
        this.loading = false;
        this.token = data.token;
        this.error = "";
      }).catch((error) => {
        console.log(error);
        this.loading = false;
        this.error = "Problem while tokenizing your card details";
        this.token = "";
      });
    }
  },
  mounted() {
    window.Chargebee.init({
      site: "honeycomics-v3-test",
      publishableKey: "test_qoH22RugUvm5IcxoqUD5Svdcu9mX5figf"
    })
    this.cbInstance = window.Chargebee.getInstance();
  },
  data() {
    return {
      token: "",
      error: "",
      loading: false,
      firstName: "",
      cbInstance: null,
      
      // Options for card-component
      // custom classes 
      classes: {
        focus: 'focus',
        invalid: 'invalid',
        empty: 'empty',
        complete: 'complete',
      },

      // Custom fonts
      fonts: [
        "https://fonts.googleapis.com/css?family=Lato:400,700"
      ],

      // Placeholders
      placeholder: {
        number: "4111 1111 1111 1111",
        cvv: "CVV",
        expiry: "MM / YY",
      },

      // Locale
      locale: "en",

      // Custom styles
      styles: {
        // Styles for default state
        base: {
          color: '#333',
          fontWeight: '500',
          fontFamily: 'Lato, Segoe UI, Helvetica Neue, sans-serif',
          fontSize: '16px',
          fontSmoothing: 'antialiased',

          ':focus': {
            color: '#424770',
          },

          '::placeholder': {
            color: 'transparent',
          },

          ':focus::placeholder': {
            color: '#7b808c',
          },
        },

        // Styles for invalid state
        invalid: {
          color: '#e41029',

          ':focus': {
            color: '#e44d5f',
          },
          '::placeholder': {
            color: '#FFCCA5',
          },
        },
      }
    }
  },
}
</script>


<style>
body{
  background-color: #2c2e33;  
  color: #fff;
  font-family: 'Roboto',-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
  font-size: 16px;
  line-height: 1.4;
  font-weight: 300;
  /* -webkit-font-smoothing: antialiased; */
}
</style>
<style scoped>
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  outline: none;
}

a{
  cursor: pointer;
  color: inherit;  
  text-decoration: none;
  border-bottom: 1px dotted;
}

.ex1.container {
  margin: auto;
  padding: 100px 0;
  min-height: 100vh;
}

.ex1-wrap{
  max-width: 400px;
  margin: auto;
  border-radius: 8px;
  background: #fff;
  padding: 32px;
}

.ex1-field{
  position: relative;
  margin-bottom: 32px;
}
.ex1-fields{
  display: flex;
  margin-left: -16px;
}
.ex1-fields .ex1-field{
  flex: 1;    
  margin-left: 16px;
}
.ex1-label{  
  font-size: 12px;
  font-weight: 500;  
  color: #7b808c;
  position: absolute;
  top: 0.25rem;
  pointer-events: none;
  padding-left: 0.125rem;
  z-index: 1;  
  font-weight: normal;
  -webkit-transition: all 0.28s ease;
  transition: all 0.28s ease;
}
.ex1-input{
  width: 100%;
  display: block;
  background: transparent;
  border-radius: 0;
  border: none;
  padding: 4px 2px;  
  border-width: 0;
  border-color: transparent;
  color: #333;
  font-size: 16px;
  font-family: inherit;
  font-weight: 500;
  transition: .2s;
  cursor: text;
  /* font-weight: inherit; */
  -webkit-transition: all 0.28s ease;
  transition: all 0.28s ease;
  box-shadow: none;
}
.ex1-input::placeholder{
  color: transparent;
}
.ex1-input:focus::placeholder{
  color: #7b808c;
}

.ex1-input:focus ~ .ex1-label,
.ex1-input.focus ~ .ex1-label,
.ex1-input.val ~ .ex1-label,
.ex1-input.complete ~ .ex1-label,
.ex1-input.invalid ~ .ex1-label{
    font-size: 0.8rem;
    color:#7b808c;
    top: -1rem;
    left: 0;
}
.ex1-bar{
  position: relative;
  border-bottom: 0.0625rem solid #999;
  display: block;
}
.ex1-bar::before {
  content: '';
  height: 0.125rem;
  width: 0;
  left: 50%;
  bottom: -0.0625rem;
  position: absolute;
  background: #337ab7;
  -webkit-transition: left 0.28s ease, width 0.28s ease;
  transition: left 0.28s ease, width 0.28s ease;
  z-index: 2;
}
.ex1-input:focus ~ .ex1-bar::before,
.ex1-input.focus ~ .ex1-bar::before{
  width: 100%;
  left: 0;
}
.ex1-button{
  background: #0950cc;
  background: #0c0ebd;
  color: #fff;
  font-size: 16px;
  font-family: inherit;
  border: none;
  border-radius: 4px;  
  padding: 12px 20px;
  display: block;
  width: 100%;
  letter-spacing: .5px;
  transition: .2s;
  cursor: pointer;
}
.ex1-button:hover,
.ex1-button:focus{
  background: #0641a7;
  background: #0a0b9a;
}
.ex1-button.submit {
  background-image: url(data:image/svg+xml;base64,PHN2ZyBjbGFzcz0ic3ZnLWxvYWRlciIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iNTUiIGhlaWdodD0iNTUiIHZpZXdCb3g9IjAgMCA4MCA4MCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTQwIDcyQzIyLjQgNzIgOCA1Ny42IDggNDBTMjIuNCA4IDQwIDhzMzIgMTQuNCAzMiAzMmMwIDEuMS0uOSAyLTIgMnMtMi0uOS0yLTJjMC0xNS40LTEyLjYtMjgtMjgtMjhTMTIgMjQuNiAxMiA0MHMxMi42IDI4IDI4IDI4YzEuMSAwIDIgLjkgMiAycy0uOSAyLTIgMnoiPjxhbmltYXRlVHJhbnNmb3JtIGF0dHJpYnV0ZVR5cGU9InhtbCIgYXR0cmlidXRlTmFtZT0idHJhbnNmb3JtIiB0eXBlPSJyb3RhdGUiIGZyb209IjAgNDAgNDAiIHRvPSIzNjAgNDAgNDAiIGR1cj0iMC42cyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiLz48L3BhdGg+PC9zdmc+);
  background-position: 50%;
  background-repeat: no-repeat;
  background-size: 20px;
  color: transparent!important;
  transition-duration: 0s;
}

.token {
  color: #555;
  padding: 10px;
  text-align: center;
  font-weight: 500;
}

.error {
  color: #e41029;
  padding: 10px;
  text-align: center;
  font-weight: 500;
}
</style>

