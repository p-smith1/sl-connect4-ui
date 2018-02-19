import getters from './'

describe('Game Module: Getters', () => {
  describe('#getCurrentGame', () => {
    let result = null
    let state = { currentGame: 'foobar' }

    before(() => {
      result = getters.getCurrentGame(state)
    })

    it('returns current game', () => {
      expect(result).to.equal(state.currentGame)
    })
  })

  describe('#getJoinableGames', () => {
    let result = null
    let state = { joinableGames: ['foo', 'bar', 'fizz', 'buzz'] }

    before(() => {
      result = getters.getJoinableGames(state)
    })

    it('returns joinable games', () => {
      expect(result).to.equal(state.joinableGames)
    })
  })
})
