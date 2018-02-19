import mutations from './mutations'
import actions from './actions'
import getters from './getters'

const state = {}

const module = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
}

export default module
