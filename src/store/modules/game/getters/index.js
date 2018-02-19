const getters = {
  getCurrentGame: (state) => {
    return state.currentGame
  },

  getJoinableGames: (state) => {
    return state.joinableGames
  }
}

export default getters
