import Vue from 'vue'
import types from '../mutations/types'
import axios from 'axios'

const actions = {
  login: (context) => {
    return new Promise((resolve, reject) => {
      let googleAuth = Vue.googleAuth()

      googleAuth.directAccess()
      googleAuth.signIn((data) => {
        context.commit(types.SET_ACCESS_TOKEN, data.Zi.id_token)
        resolve()
      }, (error) => {
        reject(error)
      })
    })
  },

  logout: (context) => {
    return new Promise((resolve, reject) => {
      let googleAuth = Vue.googleAuth()

      googleAuth.signOut(() => {
        context.commit(types.CLEAR_ACCESS_TOKEN)
        context.commit(types.CLEAR_CURRENT_USER)
        resolve()
      }, (error) => {
        reject(error)
      })
    })
  },

  getCurrentUser: (context) => {
    return axios.get(`${process.env.BASE_API}/users/current`)
      .then((response) => {
        context.commit(types.SET_CURRENT_USER, response.data)
      })
  },

  getCurrentOpponent: (context, {userId}) => {
    return axios.get(`${process.env.BASE_API}/users/${userId}`)
      .then((response) => {
        context.commit(types.SET_CURRENT_OPPONENT, response.data)
      })
  }
}

export default actions
