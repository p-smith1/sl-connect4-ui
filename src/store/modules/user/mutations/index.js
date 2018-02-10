import types from './types'

const mutations = {
  [types.SET_PROFILE]: (state, profile) => {
    state.profile = profile
  },

  [types.CLEAR_PROFILE]: (state) => {
    delete state.profile
  },

  [types.SET_ACCESS_TOKEN]: (state, accessInfo) => {
    state.accessToken = accessInfo.access_token
  },

  [types.CLEAR_ACCESS_TOKEN]: (state) => {
    delete state.accessToken
  }
}

export default mutations
