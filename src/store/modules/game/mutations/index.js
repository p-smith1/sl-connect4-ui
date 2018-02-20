import types from './types'
import Vue from 'vue'

const mutations = {
  [types.ADD_JOINABLE_GAME]: (state, joinableGame) => {
    state.joinableGames.push(joinableGame)
  },

  [types.REMOVE_JOINABLE_GAME]: (state, nonJoinableGame) => {
    state.joinableGames = state.joinableGames.filter(game => {
      return game.id !== nonJoinableGame.id
    })
  },

  [types.SET_CURRENT_GAME]: (state, currentGame) => {
    Vue.set(state, 'currentGame', currentGame)
  },

  [types.SET_JOINABLE_GAMES]: (state, joinableGames) => {
    state.joinableGames = joinableGames
  },

  [types.SET_GAME_COLUMN]: (state, {columnIndex, playerId}) => {
    if (!state.currentGame) return

    let currentGame = state.currentGame
    const playerToken = (currentGame.primary_player_id === playerId) ? 1 : 2

    currentGame.move_count++
    currentGame.column_heights[columnIndex]++
    currentGame.board[columnIndex].find((val, rowIndex) => {
      if (val === 0) {
        currentGame.board[columnIndex][rowIndex] = playerToken
        return true
      }

      return false
    })
  },

  [types.SET_GAME_WINNER]: (state, {playerId}) => {
    let currentGame = state.currentGame
    const loserId = (playerId === currentGame.primary_player_id)
      ? currentGame.secondary_player_id
      : currentGame.primary_player_id

    currentGame.is_game_over = true
    currentGame.winner_id = playerId
    currentGame.loser_id = loserId
  },

  [types.SET_GAME_TIE]: (state) => {
    state.currentGame.is_game_over = true
  }
}

export default mutations
