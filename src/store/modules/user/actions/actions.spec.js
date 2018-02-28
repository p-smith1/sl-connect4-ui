import Vue from 'vue'
import GoogleAuth from 'vue-google-auth'
import actions from './'
import types from '../mutations/types'
import axios from 'axios'
import moxios from 'moxios'

describe('User Module: Actions', () => {
  let vuexContext
  let commitSpy
  let signInStub
  let signOutStub
  let directAccessSpy
  let googleAuthStub
  let axiosGetSpy

  before(() => {
    moxios.install()
    Vue.use(GoogleAuth, { clientId: 'foobar' })

    vuexContext = { commit: (actionText, response) => {} }
    commitSpy = sinon.spy(vuexContext, 'commit')
    axiosGetSpy = sinon.spy(axios, 'get')

    googleAuthStub = sinon.stub(Vue, 'googleAuth')
    signInStub = sinon.stub()
    signOutStub = sinon.stub()
    directAccessSpy = sinon.spy()

    googleAuthStub.callsFake(() => {
      return {
        directAccess: directAccessSpy,
        signIn: signInStub,
        signOut: signOutStub
      }
    })
  })

  after(() => {
    moxios.uninstall()
    googleAuthStub.restore()
    axiosGetSpy.restore()
  })

  describe('#login', () => {
    context('when login is successful', () => {
      const accessInfo = { Zi: { id_token: 'foobar' } }

      before(async () => {
        signInStub.callsFake((resolve, reject) => {
          resolve(accessInfo)
        })

        await actions.login(vuexContext)
      })

      it('calls signin to Google 0Auth', () => {
        expect(directAccessSpy).to.have.been.called
        expect(signInStub).to.have.been.called
      })

      it('commits the access information', () => {
        expect(vuexContext.commit).to.have.been
          .calledWith(types.SET_ACCESS_TOKEN, accessInfo.Zi.id_token)
      })
    })

    context('when login fails', () => {
      let result
      const errorInfo = { foo: 'bar' }

      before(async () => {
        commitSpy.resetHistory()

        signInStub.callsFake((resolve, reject) => {
          reject(errorInfo)
        })

        result = await actions.login(vuexContext).catch(e => e)
      })

      it('does not commit anything', () => {
        expect(vuexContext.commit).not.to.have.been.called
      })

      it('returns error', () => {
        expect(result).to.equal(errorInfo)
      })
    })
  })

  describe('#logout', () => {
    context('when logout is successful', () => {
      before(async () => {
        signOutStub.callsFake((resolve, reject) => {
          resolve()
        })

        await actions.logout(vuexContext)
      })

      it('calls signout to Google 0Auth', () => {
        expect(signOutStub).to.have.been.called
      })

      it('clears the access token', () => {
        expect(vuexContext.commit).to.have.been
          .calledWith(types.CLEAR_ACCESS_TOKEN)
      })

      it('clears the current user', () => {
        expect(vuexContext.commit).to.have.been
          .calledWith(types.CLEAR_CURRENT_USER)
      })
    })

    context('when logout fails', () => {
      let result = null
      const errorInfo = { jim: 'bean' }

      before(async () => {
        commitSpy.resetHistory()

        signOutStub.callsFake((resolve, reject) => {
          reject(errorInfo)
        })

        result = await actions.logout(vuexContext).catch(e => e)
      })

      it('does not commit anything', () => {
        expect(vuexContext.commit).not.to.have.been.called
      })

      it('returns error', () => {
        expect(result).to.equal(errorInfo)
      })
    })
  })

  describe('#getCurrentUser', () => {
    const apiUrl = `${process.env.BASE_API}/users/current`
    const currentUser = { foo: 'bar' }

    context('when successful', () => {
      before((done) => {
        moxios.wait(() => {
          const request = moxios.requests.mostRecent()

          request.respondWith({
            status: 200,
            response: currentUser
          })

          done()
        })

        actions.getCurrentUser(vuexContext)
      })

      it('makes request to api', () => {
        expect(axios.get).to.have.been.calledWith(apiUrl)
      })

      it('commits the current user', () => {
        expect(vuexContext.commit).to.have.been
          .calledWith(types.SET_CURRENT_USER, currentUser)
      })
    })

    context('when unsuccessful', () => {
      before((done) => {
        moxios.wait(() => {
          const request = moxios.requests.mostRecent()

          request.respondWith({
            status: 400,
            responseText: 'Error!@#'
          })

          done()
        })

        actions.getCurrentUser(vuexContext)
      })

      it('does not commit', () => {
        expect(vuexContext.commit).to.have.been.called
      })
    })
  })

  describe('#getCurrentOpponent', () => {
    const apiUrl = `${process.env.BASE_API}/users/current`
    const currentOpponentId = 42
    const currentOpponent = { id: currentOpponentId }

    context('when successful', () => {
      before((done) => {
        moxios.wait(() => {
          const request = moxios.requests.mostRecent()

          request.respondWith({
            status: 200,
            response: currentOpponent
          })

          done()
        })

        actions.getCurrentOpponent(vuexContext, {userId: currentOpponentId})
      })

      it('makes request to api', () => {
        expect(axios.get).to.have.been.calledWith(apiUrl)
      })

      it('commits the current user', () => {
        expect(vuexContext.commit).to.have.been
          .calledWith(types.SET_CURRENT_OPPONENT, currentOpponent)
      })
    })

    context('when unsuccessful', () => {
      before((done) => {
        moxios.wait(() => {
          const request = moxios.requests.mostRecent()

          request.respondWith({
            status: 400,
            responseText: 'Error!@#'
          })

          done()
        })

        actions.getCurrentOpponent(vuexContext, {userId: 43})
      })

      it('does not commit', () => {
        expect(vuexContext.commit).to.have.been.called
      })
    })
  })
})
