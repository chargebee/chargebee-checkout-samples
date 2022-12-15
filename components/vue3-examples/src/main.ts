import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import ChargebeeWrappers from "@chargebee/chargebee-js-vue-wrapper";

const app = createApp(App);

app.config.unwrapInjectedRef = true;
app.use(router);
app.use(ChargebeeWrappers);

app.mount("#app");