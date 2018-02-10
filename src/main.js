// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import GoogleAuth from 'vue-google-auth'

Vue.config.productionTip = false

Vue.use(GoogleAuth, { clientID: process.env.GOOGLE_CLIENT_ID })
Vue.use(Vuex)

Vue.googleAuth().load()

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
