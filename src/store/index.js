import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistedState from 'vuex-persistedstate'

import userModule from './modules/user'

Vue.use(Vuex)

const state = {}

const store = new Vuex.Store({
  state,
  plugins: [VuexPersistedState()],
  modules: {
    user: userModule
  }
})

export default store
