import axios from 'axios'
import store from '@/store'
import types from '@/store/modules/user/mutations/types'
import router from '@/router'

export default {
  install (Vue, options) {
    axios.interceptors.request.use((config) => {
      const accessToken = store.state.user.accessToken
      const hasAuthHeader = config.headers.post.hasOwnProperty('Authorization')

      if (accessToken && !hasAuthHeader) {
        this.setAuthHeader(config, accessToken)
      }

      return config
    })

    axios.interceptors.response.use(
      (response) => {
        return response
      },
      (error) => {
        if (this._isInvalidToken(error.response)) {
          this.logout()
        }

        return Promise.reject(error)
      })

    Vue.prototype.$auth = Vue.auth = this
  },

  setAuthHeader (request, token) {
    request.headers.Authorization = token
  },

  logout () {
    store.commit(`user/${types.CLEAR_ACCESS_TOKEN}`)
    store.commit(`user/${types.CLEAR_PROFILE}`)
    router.push({ name: 'Home' })
  },

  _isInvalidToken (response) {
    const status = response.status

    return (status === 401)
  }
}
