import Vue from 'vue'
import GoogleAuth from 'vue-google-auth'
import actions from './'
import types from '../mutations/types'

describe('User Module: Actions', () => {
  let vuexContext
  let commitSpy
  let signInStub
  let directAccessSpy
  let googleAuthStub

  before(() => {
    Vue.use(GoogleAuth, { clientID: 'foobar' })

    vuexContext = { commit: (actionText, response) => {} }
    commitSpy = sinon.spy(vuexContext, 'commit')

    googleAuthStub = sinon.stub(Vue, 'googleAuth')
    signInStub = sinon.stub()
    directAccessSpy = sinon.spy()

    googleAuthStub.callsFake(() => {
      return {
        directAccess: directAccessSpy,
        signIn: signInStub
      }
    })
  })

  after(() => {
    googleAuthStub.restore()
  })

  describe('#login', () => {
    context('when login is successful', () => {
      const accessInfo = { access_token: 'foobar' }

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
        expect(vuexContext.commit).to.have.been.calledWith(types.SET_ACCESS_TOKEN, accessInfo.access_token)
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
})
