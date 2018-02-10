import Vue from 'vue'
import types from '../mutations/types'

const actions = {
  login: (context) => {
    return new Promise((resolve, reject) => {
      let googleAuth = Vue.googleAuth()

      googleAuth.directAccess()
      googleAuth.signIn((data) => {
        context.commit(types.SET_ACCESS_INFO, data)
        resolve()
      }, (error) => {
        reject(error)
      })
    })
  }
}

export default actions
