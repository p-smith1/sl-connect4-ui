import store from '@/store'
import types from '@/store/modules/game/mutations/types'

const callbacks = {
  availableGamesChannel: {
    received: (data) => {
      const mutationType = (data.is_joinable)
        ? types.ADD_JOINABLE_GAME
        : types.REMOVE_JOINABLE_GAME

      store.commit(`game/${mutationType}`, data.game)

      const currentGameId = (store.state.game.currentGame)
        ? store.state.game.currentGame.id
        : null

      if (currentGameId === data.game.id) {
        store.commit(`game/${types.SET_CURRENT_GAME}`, data.game)
      }
    }
  },

  playGameChannel: {
    received: (data) => {
      if (data.move_type !== 'invalid_move') {
        store.commit(`game/${types.SET_GAME_COLUMN}`, {
          columnIndex: data.column_index,
          playerId: data.played_by.id
        })
      }

      switch (data.move_type) {
        case 'winning_move':
          store.commit(`game/${types.SET_GAME_WINNER}`, {
            playerId: data.played_by.id
          })
          break
        case 'tie_move':
          store.commit(`game/${types.SET_GAME_TIE}`)
          break
        default:
          break
      }
    }
  }
}

export default callbacks
