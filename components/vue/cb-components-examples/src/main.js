import Vue from 'vue'
import VueRouter from "vue-router"
import App from './App.vue'
import Example1 from "./components/example1/Example1.vue";
import Example2 from "./components/example2/Example2.vue";
import Example3 from "./components/example3/Example3.vue";

Vue.use(VueRouter)
Vue.config.productionTip = false

const router = new VueRouter({
  routes: [
    {
      path: '/example1',
      component: Example1,
    },
    {
      path: '/example2',
      component: Example2
    },
    {
      path: "/example3",
      component: Example3
    },
    {
      path: "/",
      redirect: "/example1"
    }
  ],
  base: "/vue",
  // mode: 'history',
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
