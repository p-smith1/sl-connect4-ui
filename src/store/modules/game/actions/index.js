import axios from 'axios'
import types from '../mutations/types'

const actions = {
  getJoinableGames: (context) => {
    return axios.get(`${process.env.BASE_API}/boards`, {
      secondary_player: null,
      is_opponent_ai: false
    }).then((response) => {
      context.commit(types.SET_JOINABLE_GAMES, response.data)
    })
  }
}

export default actions
