// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import App from './App'
import GoogleAuth from 'vue-google-auth'

import router from './router'
import store from './store'

Vue.config.productionTip = false

Vue.use(GoogleAuth, { clientID: process.env.GOOGLE_CLIENT_ID })
Vue.use(Vuex)

if (process.env.NODE_ENV !== 'testing') {
  Vue.use(VueRouter)
}

Vue.googleAuth().load()

/* eslint-disable no-new */
new Vue({
  components: { App },
  el: '#app',
  router,
  store,
  template: '<App/>'
})
