import actions from './'
import axios from 'axios'
import moxios from 'moxios'
import types from '../mutations/types'

describe('Game Module: Actions', () => {
  let vuexContext
  let axiosGetSpy
  let axiosPostSpy
  let axiosPutSpy

  const boardsData = { foo: 'bar' }

  before(() => {
    moxios.install()

    vuexContext = { commit: (actionText, response) => {} }
    sinon.spy(vuexContext, 'commit')

    axiosGetSpy = sinon.spy(axios, 'get')
    axiosPostSpy = sinon.spy(axios, 'post')
    axiosPutSpy = sinon.spy(axios, 'put')

    moxios.stubRequest(`${process.env.BASE_API}/boards`, {
      status: 200,
      response: boardsData
    })
  })

  after(() => {
    moxios.uninstall()
    axiosGetSpy.restore()
    axiosPostSpy.restore()
    axiosPutSpy.restore()
  })

  describe('#getJoinableGames', () => {
    context('when call is successful', () => {
      before(async () => {
        await actions.getJoinableGames(vuexContext)
      })

      it('makes a get request', () => {
        expect(axios.get).to.have.been.calledWith(`${process.env.BASE_API}/boards`, {
          secondary_player: null,
          is_opponent_ai: false
        })
      })

      it('commits the joinable games data', () => {
        expect(vuexContext.commit).to.have.been
          .calledWith(types.SET_JOINABLE_GAMES, boardsData)
      })
    })
  })

  describe('#createGame', () => {
    const isOpponentAi = false

    before(async () => {
      await actions.createGame(vuexContext, {isOpponentAi})
    })

    it('makes a post request', () => {
      expect(axios.post).to.have.been
        .calledWith(`${process.env.BASE_API}/boards`, {
          is_opponent_ai: isOpponentAi
        })
    })

    it('commits created game', () => {
      expect(vuexContext.commit).to.have.been
        .calledWith(types.SET_CURRENT_GAME, boardsData)
    })
  })

  describe('#joinGame', () => {
    const boardId = 5
    const primaryPlayerId = 23
    const userId = 42

    const board = {
      id: boardId,
      primary_player_id: primaryPlayerId,
      secondary_player_id: null,
      current_player_id: null
    }

    const currentGameBoard = {
      id: boardId,
      primary_player_id: primaryPlayerId,
      secondary_player_id: userId,
      current_player_id: primaryPlayerId
    }

    before(async () => {
      moxios.stubRequest(`${process.env.BASE_API}/boards/${boardId}`, {
        status: 200,
        response: board
      })

      await actions.joinGame(vuexContext, {board, userId})
    })

    it('makes a put request', () => {
      expect(axios.put).to.have.been
        .calledWith(`${process.env.BASE_API}/boards/${boardId}`, {
          secondary_player_id: userId
        })
    })

    it('commits created game', () => {
      expect(vuexContext.commit).to.have.been
        .calledWith(types.SET_CURRENT_GAME, currentGameBoard)
    })
  })
})
