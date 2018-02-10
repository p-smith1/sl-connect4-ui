import mutations from './mutations'
import actions from './actions'

const state = {}

const module = {
  namespaced: true,
  state,
  actions,
  mutations
}

export default module
