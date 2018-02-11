import mutations from './'

describe('User Module: Mutations', () => {
  describe('#SET_PROFILE', () => {
    let state = {}

    let profile = {
      token: 'token',
      storeNumber: '1234',
      ldap: 'abc123',
      firstNmae: 'John',
      lastName: 'Doe'
    }

    before(() => {
      mutations.SET_PROFILE(state, profile)
    })

    it('sets the state of the profile object', () => {
      expect(state.profile).to.equal(profile)
    })
  })

  describe('#CLEAR_PROFILE', () => {
    let state = {
      profile: {
        token: 'token',
        storeNumber: '1234',
        ldap: 'abc123',
        firstNmae: 'John',
        lastName: 'Doe'
      }
    }

    before(() => {
      mutations.CLEAR_PROFILE(state)
    })

    it('clears the user profile from state', () => {
      expect(state.profile).to.be.undefined
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
