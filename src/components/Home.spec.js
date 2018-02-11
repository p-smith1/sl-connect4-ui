import Home from './Home'
import Vue from 'vue'
import Vuex from 'vuex'
import GoogleAuth from 'vue-google-auth'
import { createLocalVue, shallow } from '@vue/test-utils'

import userActions from '@/store/modules/user/actions'
import userMutations from '@/store/modules/user/mutations'

describe('Component: Home', () => {
  const localVue = createLocalVue()

  let component
  let loginSpy
  let googleAuthStub
  let signInStub
  let $router

  before(() => {
    Vue.use(GoogleAuth, { clientId: 'foobar' })
    localVue.use(Vuex)

    loginSpy = sinon.spy(userActions, 'login')

    googleAuthStub = sinon.stub(Vue, 'googleAuth')
    signInStub = sinon.stub()

    googleAuthStub.callsFake(() => {
      return {
        directAccess: () => {},
        signIn: signInStub
      }
    })

    $router = {
      push: sinon.spy()
    }

    const mockUserModule = {
      namespaced: true,
      state: {},
      actions: userActions,
      mutations: userMutations
    }

    const store = new Vuex.Store({
      modules: {
        user: mockUserModule
      }
    })

    component = shallow(Home, {
      localVue,
      mocks: {
        $router
      },
      store
    })
  })

  after(() => {
    loginSpy.restore()
    googleAuthStub.restore()
  })

  context('when user clicks to login', () => {
    context('when login is successful', () => {
      before((done) => {
        signInStub.callsFake((resolve, reject) => {
          resolve({ Zi: { access_token: 'foobar' } })
        })

        let loginBtn = component.find('#loginBtn')
        loginBtn.trigger('click')

        localVue.nextTick(done)
      })

      it('redirects to Google for authentication', () => {
        expect(userActions.login).to.have.been.called
      })

      it('routes user to the game', () => {
        expect($router.push).to.have.been.calledWith({ name: 'Dashboard' })
      })
    })

    context('when login fails', () => {
      before((done) => {
        signInStub.callsFake((resolve, reject) => {
          reject({ foo: 'bar' })
        })

        let loginBtn = component.find('#loginBtn')
        loginBtn.trigger('click')

        localVue.nextTick(done)
      })

      it('shows error message', () => {
        let loginErrorMsg = component.find('#loginErrorMsg')

        expect(loginErrorMsg.element).not.to.be.undefined
      })
    })
  })
})
