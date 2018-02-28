import Vue from 'vue'
import types from './types'

const mutations = {
  [types.SET_CURRENT_USER]: (state, currentUser) => {
    Vue.set(state, 'currentUser', currentUser)
  },

  [types.SET_CURRENT_OPPONENT]: (state, opponent) => {
    Vue.set(state, 'currentOpponent', opponent)
  },

  [types.CLEAR_CURRENT_USER]: (state) => {
    delete state.currentUser
  },

  [types.SET_ACCESS_TOKEN]: (state, accessToken) => {
    state.accessToken = accessToken
  },

  [types.CLEAR_ACCESS_TOKEN]: (state) => {
    delete state.accessToken
  }
}

export default mutations
