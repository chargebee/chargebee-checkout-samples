<template>
  <div class="ex2 container">
    <div class="ex2-wrap">
      <div class="ex2-fieldset">
        <label class="ex2-field">
          <span class="ex2-label">Name</span>
          <input
            class="ex2-input"
            v-model="firstName"
            type="text"
            placeholder="John Doe"
          />
        </label>
        <label class="ex2-field">
          <span class="ex2-label">Email</span>
          <input
            class="ex2-input"
            type="text"
            v-model="email"
            placeholder="john@comp.any"
          />
        </label>
        <label class="ex2-field">
          <span class="ex2-label">Phone</span>
          <input
            class="ex2-input"
            type="text"
            v-model="phone"
            placeholder="+63 53242 32637"
          />
        </label>
        <label class="ex2-field">
          <!-- Render card component in combined-mode -->
          <!-- Pass options, assign ref and attach listeners -->
          <CardComponent
            ref="card"
            class="ex2-input fieldset field"
            :icon="cardIcon"
            :styles="styles"
            :fonts="fonts"
            :classes="classes"
            @ready="onReady"
          />
        </label>
      </div>
      <button
        type="submit"
        :class="{ submit: loading }"
        class="ex2-button"
        @click="tokenize"
      >
        Pay $x & Tokenize
      </button>
      <div class="error" role="alert" v-if="error">{{ error }}</div>
      <div class="token" v-if="token">{{ token }}</div>
      <h4 class="title">Change theme:</h4>
      <div class="theme-palette" style="margin-top: 15px">
        <button id="theme-1" class="ex2-button" @click="(e) => setTheme(e, 0)">
          Theme1
        </button>
        <button id="theme-2" class="ex2-button" @click="(e) => setTheme(e, 1)">
          Theme2
        </button>
        <button id="theme-3" class="ex2-button" @click="(e) => setTheme(e, 2)">
          Theme3
        </button>
        <button id="theme-4" class="ex2-button" @click="(e) => setTheme(e, 3)">
          Theme4
        </button>
      </div>
      <h4 class="title">Actions:</h4>
      <div class="action-palette">
        <button @click="toggleCardIcon" class="ex2-button small">Icon</button>
        &nbsp;
        <button @click="clear" class="ex2-button small">Clear</button> &nbsp;
        <button @click="increaseFontSize" class="ex2-button small">
          + font
        </button>
        &nbsp;
        <button @click="decreaseFontSize" class="ex2-button small">
          - font
        </button>
        &nbsp;
        <button @click="focus" class="ex2-button small">focus</button>
      </div>
    </div>
  </div>
</template>

<script>
import { CardComponent } from "@chargebee/chargebee-js-vue-wrapper";

export default {
  name: "ExampleTwo",

  components: {
    CardComponent,
  },

  methods: {
    tokenize() {
      this.loading = true;
      // Call tokenize method through card component's ref
      this.$refs.card
        .tokenize({})
        .then((data) => {
          this.loading = false;
          this.token = data.token;
          this.error = "";
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
          this.error = "Problem while tokenizing your card details";
          this.token = "";
        });
    },

    // Called when card component is mounted and ready
    onReady() {
      console.log("On ready card");
      this.$refs.card.focus();
    },

    // Invoke this function to clear contents of all the fields
    clear() {
      this.$refs.card.clear();
    },

    // Update any of the options passed to the card component, it will take effect immediately
    toggleCardIcon() {
      this.cardIcon = !this.cardIcon;
    },

    setFontSize() {
      console.log(this.fontSize);
      this.styles.base = {
        ...this.styles.base,
        fontSize: `${this.fontSize}px`,
      };
      // this.styles.base.fontSize = `${this.fontSize}px`
    },

    focus() {
      this.$refs.card.focus();
    },

    increaseFontSize() {
      this.fontSize = this.fontSize + 1;
      this.setFontSize();
    },

    decreaseFontSize() {
      this.fontSize = this.fontSize - 1;
      this.setFontSize();
    },

    setTheme(event, index) {
      event.preventDefault();
      const theme = this.themes[index];
      let root = document.documentElement;
      root.style.setProperty("--main-bg", theme["main-bg"]);
      root.style.setProperty("--secondary-bg", theme["secondary-bg"]);
      root.style.setProperty("--main-text", theme["main-text"]);
      root.style.setProperty("--placeholder", theme["placeholder"]);
      root.style.setProperty(
        "--placeholder-focused",
        theme["placeholder-focused"]
      );
      root.style.setProperty("--primary-btn", theme["primary-btn"]);
      root.style.setProperty("--btn-text", theme["btn-text"]);
      root.style.setProperty("--primary-btn-focus", theme["primary-btn-focus"]);

      this.styles = this.getIframeStyles(theme);
    },

    getIframeStyles(theme) {
      return {
        base: {
          color: theme["main-text"],
          fontWeight: "500",
          fontFamily:
            "Lato,-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica Neue, sans-serif",
          fontSize: "16px",
          fontSmoothing: "antialiased",
          iconColor: theme["main-text"],

          ":focus": {
            // color: '#424770',
          },

          "::placeholder": {
            color: theme["placeholder"],
          },

          ":focus::placeholder": {
            color: theme["placeholder-focused"],
          },
        },
        invalid: {
          color: theme["invalid"] || "#FF7C4A",

          ":focus": {
            color: theme["invalid-focused"] || "#e44d5f",
          },
          "::placeholder": {
            color: theme["invalid-placeholder"] || "#FFCCA5",
          },
        },
      };
    },
  },

  data() {
    const THEMES = [
      {
        "main-bg": "#262E3A",
        "secondary-bg": "#3e4b5b",
        "main-text": "#fff",
        placeholder: "#939aa3",
        "placeholder-focused": "#ccc",
        "primary-btn": "#6EEDB6",
        "btn-text": "#1C2026",
        "primary-btn-focus": "rgb(70, 203, 145)",
        invalid: "#FF7C4A",
        "invalid-focused": "#e44d5f",
        "invalid-placeholder": "#FFCCA5",
      },
      {
        "main-bg": "#D5DBE7",
        "secondary-bg": "#fff",
        "main-text": "#000",
        placeholder: "#abacbe",
        "placeholder-focused": "#abacbe",
        "primary-btn": "#4773D2",
        "btn-text": "#fff",
        "primary-btn-focus": "#3361c3",
        invalid: "#E94745",
        "invalid-focused": "#e44d5f",
        "invalid-placeholder": "#FFCCA5",
      },
      {
        "main-bg": "#fca571",
        "secondary-bg": "#fff",
        "main-text": "#252857",
        placeholder: "#9293AB",
        "placeholder-focused": "#666",
        "primary-btn": "#252857",
        "btn-text": "#fff",
        "primary-btn-focus": "#191c4a",
        invalid: "#E94745",
        "invalid-focused": "#e44d5f",
        "invalid-placeholder": "#FFCCA5",
      },
      {
        "main-bg": "#544FB0",
        "secondary-bg": "#fff",
        "main-text": "#35A9BD",
        placeholder: "ddd",
        "placeholder-focused": "#ddd",
        "primary-btn": "#35A9BD",
        "btn-text": "#fff",
        "primary-btn-focus": "rgb(29, 138, 157)",
      },
    ];
    return {
      token: "",
      error: "",
      loading: false,
      firstName: "",
      email: "",
      phone: "",
      cardIcon: true,
      fontSize: 16,
      themes: THEMES,
      styles: this.getIframeStyles(THEMES[0]),
    };
  },
  computed: {
    // Custom classes
    classes() {
      return {
        focus: "focus",
        invalid: "invalid",
        empty: "empty",
        complete: "complete",
      };
    },

    // Custom fonts
    fonts() {
      return ["https://fonts.googleapis.com/css?family=Lato:300,500,600"];
    },
  },
};
</script>

<style>
:root {
  --main-bg: #262e3a;
  --secondary-bg: #3e4b5b;
  --main-text: #fff;
  --placeholder: #939aa3;
  --placeholder-focused: #ccc;
  --primary-btn: #6eedb6;
  --btn-text: #1c2026;
  --primary-btn-focus: rgb(70, 203, 145);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  outline: none;
  font-family: "Lato";
}

body {
  background: var(--main-bg);
  color: var(--main-text);
  font-family: "Lato", -apple-system, BlinkMacSystemFont, "Segoe UI",
    "Helvetica Neue", sans-serif;
  font-size: 16px;
  line-height: 1.4;
  font-weight: 300;
  /* -webkit-font-smoothing: antialiased; */
}

a {
  cursor: pointer;
  color: inherit;
  text-decoration: none;
  border-bottom: 1px dotted;
}

.ex2.container {
  margin: auto;
  padding: 100px 0;
  min-height: 100vh;
  background: var(--main-bg);
}

.ex2-wrap {
  max-width: 400px;
  margin: auto;
}

.ex2-field {
  position: relative;
  margin-bottom: 16px;
  display: flex;
  background: var(--secondary-bg);
  border-radius: 4px;
  align-items: center;
}

.ex2-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--main-text);
  flex-basis: 80px;
  padding: 4px 0 4px 16px;
}

.ex2-input {
  width: 100%;
  display: block;
  background: transparent;
  border-radius: 0;
  border: none;
  padding: 12px 16px;
  border-width: 0;
  border-color: transparent;
  color: var(--main-text);
  font-size: 16px;
  font-family: inherit;
  font-weight: 500;
  transition: 0.2s;
  cursor: text;
  /* font-weight: inherit; */
  -webkit-transition: all 0.28s ease;
  transition: all 0.28s ease;
  box-shadow: none;
}

.ex2-input::placeholder {
  color: var(--placeholder);
}

.ex2-input:focus::placeholder {
  color: var(--placeholder-focused);
}

.ex2-input:focus ~ .ex2-label,
.ex2-input.focus ~ .ex2-label,
.ex2-input.complete ~ .ex2-label,
.ex2-input.invalid ~ .ex2-label {
  font-size: 0.8rem;
  color: var(--main-text);
  top: -1rem;
  left: 0;
}

.ex2-bar {
  position: relative;
  border-bottom: 0.0625rem solid #999;
  display: block;
}

.ex2-bar::before {
  content: "";
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

.ex2-input:focus ~ .ex2-bar::before,
.ex2-input.focus ~ .ex2-bar::before {
  width: 100%;
  left: 0;
}

.ex2-button {
  background: var(--primary-btn);
  color: var(--btn-text);
  font-size: 16px;
  font-family: inherit;
  border: none;
  border-radius: 4px;
  padding: 12px 20px;
  display: block;
  width: 100%;
  letter-spacing: 0.5px;
  transition: 0.2s;
  cursor: pointer;
}

.ex2-button:hover,
.ex2-button:focus {
  background: var(--primary-btn-focus);
}

.token {
  color: #fff;
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

.ex2-button.submit {
  background-image: url(data:image/svg+xml;base64,PHN2ZyBjbGFzcz0ic3ZnLWxvYWRlciIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iNTUiIGhlaWdodD0iNTUiIHZpZXdCb3g9IjAgMCA4MCA4MCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTQwIDcyQzIyLjQgNzIgOCA1Ny42IDggNDBTMjIuNCA4IDQwIDhzMzIgMTQuNCAzMiAzMmMwIDEuMS0uOSAyLTIgMnMtMi0uOS0yLTJjMC0xNS40LTEyLjYtMjgtMjgtMjhTMTIgMjQuNiAxMiA0MHMxMi42IDI4IDI4IDI4YzEuMSAwIDIgLjkgMiAycy0uOSAyLTIgMnoiPjxhbmltYXRlVHJhbnNmb3JtIGF0dHJpYnV0ZVR5cGU9InhtbCIgYXR0cmlidXRlTmFtZT0idHJhbnNmb3JtIiB0eXBlPSJyb3RhdGUiIGZyb209IjAgNDAgNDAiIHRvPSIzNjAgNDAgNDAiIGR1cj0iMC42cyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiLz48L3BhdGg+PC9zdmc+);
  background-position: 50%;
  background-repeat: no-repeat;
  background-size: 20px;
  color: transparent !important;
  transition-duration: 0s;
}

.ex2-button.small {
  height: 30px;
  padding: 0;
}

.theme-palette {
  display: flex;
  margin-top: 20px;
}

.theme-palette > .ex2-button {
  margin: 0 5px;
  padding: 5px 10px;
  height: 50%;
  font-size: 14px;
}

.action-palette {
  margin-top: 15px;
  display: flex;
  margin-bottom: 15px;
  font-size: 14px;
}

.title {
  color: var(--main-text);
  margin-top: 30px;
}
</style>
