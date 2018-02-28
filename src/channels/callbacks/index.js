import store from '@/store'
import gameTypes from '@/store/modules/game/mutations/types'

const callbacks = {
  availableGamesChannel: {
    received: (data) => {
      const mutationType = (data.is_joinable)
        ? gameTypes.ADD_JOINABLE_GAME
        : gameTypes.REMOVE_JOINABLE_GAME

      store.commit(`game/${mutationType}`, data.game)

      const currentGameId = (store.state.game.currentGame)
        ? store.state.game.currentGame.id
        : null

      if (currentGameId === data.game.id) {
        store.commit(`game/${gameTypes.SET_CURRENT_GAME}`, data.game)
        store.dispatch('user/getCurrentOpponent', { userId: data.game.secondary_player_id })
      }
    }
  },

  playGameChannel: {
    received: (data) => {
      if (data.move_type !== 'invalid_move') {
        store.commit(`game/${gameTypes.SET_GAME_COLUMN}`, {
          columnIndex: data.column_index,
          playerId: data.played_by ? data.played_by.id : 0
        })
      }

      switch (data.move_type) {
        case 'winning_move':
          store.commit(`game/${gameTypes.SET_GAME_WINNER}`, {
            playerId: data.played_by ? data.played_by.id : 0
          })
          break
        case 'tie_move':
          store.commit(`game/${gameTypes.SET_GAME_TIE}`)
          break
        default:
          break
      }
    }
  }
}

export default callbacks
