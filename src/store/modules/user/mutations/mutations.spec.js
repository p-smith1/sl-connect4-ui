import mutations from './'

describe('User Module: Mutations', () => {
  describe('#SET_CURRENT_USER', () => {
    let state = {}

    let currentUser = {
      name: 'John Doe'
    }

    before(() => {
      mutations.SET_CURRENT_USER(state, currentUser)
    })

    it('sets the state of the profile object', () => {
      expect(state.currentUser).to.equal(currentUser)
    })
  })

  describe('#SET_CURRENT_OPPONENT', () => {
    let state = {}
    const opponent = { foo: 'bar' }

    before(() => {
      mutations.SET_CURRENT_OPPONENT(state, opponent)
    })

    it('sets the state of current opponent', () => {
      expect(state.currentOpponent).to.equal(opponent)
    })
  })

  describe('#CLEAR_CURRENT_USER', () => {
    let state = {
      currentUser: {
        token: 'token',
        storeNumber: '1234',
        ldap: 'abc123',
        firstNmae: 'John',
        lastName: 'Doe'
      }
    }

    before(() => {
      mutations.CLEAR_CURRENT_USER(state)
    })

    it('clears the user profile from state', () => {
      expect(state.currentUser).to.be.undefined
    })
  })

  describe('#SET_ACCESS_TOKEN', () => {
    let state = {}
    let accessToken = 'foobar'

    before(() => {
      mutations.SET_ACCESS_TOKEN(state, accessToken)
    })

    it('sets the state with access info', () => {
      expect(state.accessToken).to.equal(accessToken)
    })
  })

  describe('#CLEAR_ACCESS_TOKEN', () => {
    let state = {
      accessToken: 'foobar'
    }

    before(() => {
      mutations.CLEAR_ACCESS_TOKEN(state)
    })

    it('clears the access token from state', () => {
      expect(state.accessToken).to.be.undefined
    })
  })
})
