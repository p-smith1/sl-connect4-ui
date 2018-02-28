import axios from 'axios'
import types from '../mutations/types'

const actions = {
  getJoinableGames: (context) => {
    return axios.get(`${process.env.BASE_API}/boards`, {
      params: { type: 'joinable' }
    }).then((response) => {
      context.commit(types.SET_JOINABLE_GAMES, response.data)
    })
  },

  createGame: (context, {isOpponentAi}) => {
    return axios.post(`${process.env.BASE_API}/boards`, {
      is_opponent_ai: isOpponentAi
    }).then((response) => {
      context.commit(types.SET_CURRENT_GAME, response.data)
    })
  },

  joinGame: (context, {board, userId}) => {
    return axios.put(`${process.env.BASE_API}/boards/${board.id}`, {
      secondary_player_id: userId
    }).then((response) => {
      board.current_player_id = board.primary_player_id
      board.secondary_player_id = userId

      context.commit(types.SET_CURRENT_GAME, board)
    })
  }
}

export default actions
