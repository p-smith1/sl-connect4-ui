import getters from './'

describe('User Module: Getters', () => {
  describe('#getCurrentOpponent', () => {
    let result = null
    let state = { currentOpponent: 'foobar' }

    before(() => {
      result = getters.getCurrentOpponent(state)
    })

    it('returns current opponent', () => {
      expect(result).to.equal(state.currentOpponent)
    })
  })

  describe('#getCurrentUser', () => {
    let result = null
    let state = { currentUser: 'fizzbuzz' }

    before(() => {
      result = getters.getCurrentUser(state)
    })

    it('returns current user', () => {
      expect(result).to.equal(state.currentUser)
    })
  })
})
