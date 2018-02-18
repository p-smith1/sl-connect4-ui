import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistedState from 'vuex-persistedstate'

import userModule from './modules/user'
import gameModule from './modules/game'

Vue.use(Vuex)

const state = {}

const store = new Vuex.Store({
  state,
  plugins: [VuexPersistedState()],
  modules: {
    game: gameModule,
    user: userModule
  }
})

export default store
