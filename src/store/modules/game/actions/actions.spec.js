import actions from './'
import axios from 'axios'
import moxios from 'moxios'
import types from '../mutations/types'

describe('Game Module: Actions', () => {
  let vuexContext
  let axiosGetSpy

  before(() => {
    moxios.install()

    vuexContext = { commit: (actionText, response) => {} }
    sinon.spy(vuexContext, 'commit')

    axiosGetSpy = sinon.spy(axios, 'get')
  })

  after(() => {
    moxios.uninstall()
    axiosGetSpy.restore()
  })

  describe('#getJoinableGames', () => {
    context('when call is successful', () => {
      const joinableBoards = [{ id: 1 }, { id: 2 }, { id: 3 }]

      before(async () => {
        moxios.stubRequest(`${process.env.BASE_API}/boards`, {
          status: 200,
          response: joinableBoards
        })

        await actions.getJoinableGames(vuexContext)
      })

      it('makes a get request', () => {
        expect(axios.get).to.have.been.calledWith(`${process.env.BASE_API}/boards`, {
          secondary_player: null,
          is_opponent_ai: false
        })
      })

      it('commits the joinable games data', () => {
        expect(vuexContext.commit).to.have.been.calledWith(types.SET_JOINABLE_GAMES, joinableBoards)
      })
    })
  })
})
