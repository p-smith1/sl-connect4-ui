import VueRouter from 'vue-router'
import router from './'
import store from '@/store'
import { createLocalVue } from '@vue/test-utils'

describe('Router', () => {
  const localVue = createLocalVue()
  let storeStateStub

  before(() => {
    localVue.use(VueRouter)

    router.addRoutes([
      {
        path: '/spec/default',
        name: 'DefaultRoute',
        meta: { requiresAuth: false }
      },
      {
        path: '/spec/requiresAuth/false',
        name: 'NoRequiresAuth',
        meta: { requiresAuth: false }
      },
      {
        path: '/spec/requiresAuth/true',
        name: 'RequiresAuth',
        meta: { requiresAuth: true }
      }
    ])
  })

  context('when user navigates to route that requires authentication', () => {
    context('when user has a valid token', () => {
      before(() => {
        storeStateStub = sinon.stub(store, 'state').value({ user: { accessToken: 'askyfullofstars' } })
        router.replace({ name: 'RequiresAuth' })
      })

      after(() => {
        storeStateStub.restore()
        router.replace({ name: 'DefaultRoute' })
      })

      it('routes to the requested resource', () => {
        expect(router.currentRoute.name).to.equal('RequiresAuth')
      })
    })

    context('when user does not have a token', () => {
      before(() => {
        storeStateStub = sinon.stub(store, 'state').value({ user: {} })
        router.replace({ name: 'RequiresAuth' })
      })

      after(() => {
        storeStateStub.restore()
        router.replace({ name: 'DefaultRoute' })
      })

      after(() => {
        storeStateStub.restore()
      })

      it('routes to the home page', () => {
        expect(router.currentRoute.name).to.equal('Home')
      })
    })
  })

  context('when user navigates to route that does not require authentication', () => {
    before(() => {
      storeStateStub = sinon.stub(store, 'state').value({ user: {} })
      router.replace({ name: 'NoRequiresAuth' })
    })

    after(() => {
      storeStateStub.restore()
      router.replace({ name: 'DefaultRoute' })
    })

    it('routes to the requested resource', () => {
      expect(router.currentRoute.name).to.equal('NoRequiresAuth')
    })
  })
})
