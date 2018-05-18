import Vue from 'vue'
import App from './App.vue'
import Router from 'vue-router'
import LoginComponent from "./components/LoginComponent.vue"
import SubscriptionDetailComponent from "./components/SubscriptionDetailComponent.vue"

Vue.config.productionTip = false
Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      component: LoginComponent,
      name: 'login'
    },
    {
      path: '/profile',
      component: SubscriptionDetailComponent,
      name: 'profile'
    },
    {
      path: '/',
      redirect: {name: 'login'}
    }
  ]
})

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
