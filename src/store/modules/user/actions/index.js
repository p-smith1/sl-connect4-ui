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

  getCurrent: (context) => {
    return axios.get(`${process.env.BASE_API}/users/current`)
      .then((response) => {
        context.commit(types.SET_PROFILE, response.data)
      })
  }
}

export default actions
