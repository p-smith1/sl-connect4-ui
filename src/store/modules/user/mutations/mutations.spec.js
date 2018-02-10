import mutations from './'

describe('User Module: Mutations', () => {
  describe('#SET_ACCESS_INFO', () => {
    let state = {}
    let accessInfo = { foo: 'bar' }

    before(() => {
      mutations.SET_ACCESS_INFO(state, accessInfo)
    })

    it('sets the state with access info', () => {
      expect(state.accessInfo).to.equal(accessInfo)
    })
  })
})
