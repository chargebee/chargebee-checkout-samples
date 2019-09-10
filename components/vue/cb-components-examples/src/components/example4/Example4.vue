<template>
  <div class="ex3 container">
    <div class="ex3-wrap">
      <form id="payment">
          <div class="ex3-contain">
            <div class="ex3-fieldset">
                <div class="ex3-field">                  
                    <input class="ex3-input" type="text" placeholder="John Doe" >  
                    <i class="ex3-bar"></i>                  
                </div>  
                <CardComponent ref="card"
                  :styles="styles" 
                  :classes="classes" 
                  :fonts="fonts"
                  :locale="locale"
                  @change="onChange"
                >
                  <div class="ex3-field">   
                    <CardNumber class="ex3-input" />               
                    <i class="ex3-bar"></i>                  
                  </div>
                  <div class="ex3-fields">
                    <div class="ex3-field">                    
                        <CardExpiry class="ex3-input" />
                        <i class="ex3-bar"></i>                    
                    </div>
                    <div class="ex3-field">                    
                        <CardCvv class="ex3-input" />
                        <i class="ex3-bar"></i>                 
                    </div>
                  </div>
                </CardComponent>
            </div>
          </div>
          <button type="submit" :class="{'submit': loading}" class="ex3-button" @click="authorize">3DS Authorize</button>
          <div id="error" class="error" role="alert" v-if="errorMessage">{{errorMessage}}</div>
          <div class="token" v-if="token">{{token}}</div>
          <br />
      </form>
  </div>
  </div>
</template>

<script>
/* eslint-disable */
import { CardComponent, CardNumber, CardExpiry, CardCvv } from '@chargebee/chargebee-js-vue-wrapper';

export default {
  name: 'Example3',

  components: {
    CardComponent,
    CardNumber,
    CardExpiry,
    CardCvv
  },

  mounted() {
    this.createPaymentIntent().then(intent => {
      this.intent = intent
    })
  },

  methods: {
    createPaymentIntent(payload = {}) {
      return fetch("http://localhost:4000/payment_intent", {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }, 
        method: "POST", 
        body: JSON.stringify(payload)
      }).then(response => response.json())
    },

    authorize() {
      this.loading = true;
      // Call tokenize method through the card component's ref
      this.$refs.card.authorizeWith3ds(this.intent, this.additionalData).then(authorizedIntent => {
        this.loading = false;
        this.token = authorizedIntent.id;
        this.intent = authorizedIntent;
        this.errorMessage = "";
      }).catch((error) => {
        console.log(error);
        this.loading = false;
        this.errorMessage = "Problem while tokenizing your card details";
        this.token = "";
      });
    },

    onChange(event) {
      // Check for Validation errors
      if(event.error) {
        this.errors[event.field] = event.error
        this.errorMessage = event.error.message
      } else {
        this.errors[event.field] = null
        // If there's no error, check for existing error
        const _errors = Object.values(this.errors).filter(val => val)
        
        // The errorObject holds a message and code
        // Custom error messages can be displayed based on the error code
        const errorObj = _errors.pop();

        // Display existing message
        if(errorObj) this.errorMessage = errorObj.message
        else this.errorMessage = ''
      }
    },
  },

  data() {
    return {
      token: "",
      errorMessage: "",
      loading: false,
      firstName: "",
      errors: {},
      locale: 'en',
      intent: null,
      additionalData: {},
    }
  },

  computed: {
    fonts() {
      return [
        'https://fonts.googleapis.com/css?family=Raleway:300,500,600'
      ]
    },
    classes() {
      return {
        focus: 'focus',
        invalid: 'invalid',
        empty: 'empty',
        complete: 'complete',
      }
    },
    styles() {
      return {
          base: {
            color: '#2a2d5b',
            fontWeight: '500',
            fontFamily: 'Raleway,-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica Neue, sans-serif',
            fontSize: '16px',
            fontSmoothing: 'antialiased',

            ':focus': {
              // color: '#424770',
            },

            '::placeholder': {
              color: '#9293AB',
              fontSize: '14px',
            },

            ':focus::placeholder': {
              color: '#666',
            },
          },
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
  }
}
</script>
<style scoped>
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  outline: none;
}
body{
  background: #fca571;
  color: #252857;
  font-family: 'Raleway',-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
  font-size: 16px;
  line-height: 1.4;
  font-weight: 300;
  -webkit-font-smoothing: antialiased;
}
a{
  cursor: pointer;
  color: inherit;  
  text-decoration: none;
  border-bottom: 1px dotted;
}

.ex3.container {
  margin: auto;
  padding: 100px 0;
  min-height: 100vh;
  background: #fca571;
  color: #252857;
}

.ex3-wrap{
  max-width: 480px;
  margin: auto;
}

.ex3-contain{
  border-radius: 4px;
  background: #fff;
  padding: 24px;
  box-shadow: 0 2px 5px 0 rgba(0,0,0,0.04);
  margin-bottom: 16px;
}

.ex3-fieldset .ex3-field{
  margin-bottom: 32px;
}
.ex3-field{
  position: relative;
}
.ex3-fields{
  display: flex;
  margin-left: -16px;
}
.ex3-fields .ex3-field{
  flex: 1;    
  margin-left: 16px;
}
.ex3-label{  
  font-size: 12px;
  font-weight: 500;  
  color: #3A62BA;
  position: absolute;
  left: 0;
  bottom: 0.25rem;
  pointer-events: none;
  padding-left: 0.125rem;
  z-index: 1;  
  font-weight: normal;
  -webkit-transition: all 0.28s ease;
  transition: all 0.28s ease;
}
.ex3-input{
  width: 100%;
  display: block;
  background: transparent;
  border-radius: 0;
  border: none;
  padding: 4px 2px;  
  border-width: 0;
  border-color: transparent;
  color: #252857;
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
.ex3-input::placeholder{
  font-size: 14px;
  color: #9293AB;
}
.ex3-input:focus::placeholder{
  color: #666;
}
.ex3-input:focus ~ .ex3-label,
.ex3-input.focus ~ .ex3-label,
.ex3-input.complete ~ .ex3-label,
.ex3-input.invalid ~ .ex3-label{
    font-size: 0.8rem;
    color:#3A62BA;
    bottom: -1.2rem;    
}
.ex3-bar{
  position: relative;
  border-bottom: 0.0625rem solid #EBEBEB;
  display: block;
}
.ex3-bar::before {
  content: '';
  height: 0.125rem;
  width: 0;
  left: 50%;
  bottom: -0.0625rem;
  position: absolute;
  background: #252857;
  -webkit-transition: left 0.28s ease, width 0.28s ease;
  transition: left 0.28s ease, width 0.28s ease;
  z-index: 2;
}
.ex3-input:focus ~ .ex3-bar::before,
.ex3-input.focus ~ .ex3-bar::before,
.ex3-input.invalid ~ .ex3-bar::before{
  width: 100%;
  left: 0;
}
.ex3-input.invalid ~ .ex3-bar::before{
  background: #E94745;
}
.ex3-button{
  background: #252857;
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
.ex3-button:hover,
.ex3-button:focus{
  background: #191c4a;
}

.ex3-button.submit {
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

.language-palette {
  display: flex;
}

.language-palette > .ex3-button {
  margin: 0 10px;
  padding: 5px 10px;
  height: 50%;
  font-size: 14px;
}

.ex3-button.small {
  height: 30px;
}

</style>

