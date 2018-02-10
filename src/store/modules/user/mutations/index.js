import types from './types'

const mutations = {
  [types.SET_ACCESS_INFO]: (state, accessInfo) => {
    state.accessInfo = accessInfo
  }
}

export default mutations
