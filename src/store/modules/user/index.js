import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const state = {}

const module = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
}

export default module
