import actions from './'
import axios from 'axios'
import types from '../mutations/types'

describe('Game Module: Actions', () => {
  let vuexContext
  let axiosGetStub
  let axiosPostStub
  let axiosPutStub

  const boardsData = { foo: 'bar' }

  before(() => {
    vuexContext = { commit: (actionText, response) => {} }
    sinon.spy(vuexContext, 'commit')

    axiosGetStub = sinon.stub(axios, 'get')
    axiosPostStub = sinon.stub(axios, 'post')
    axiosPutStub = sinon.stub(axios, 'put')
  })

  after(() => {
    axiosGetStub.restore()
    axiosPostStub.restore()
    axiosPutStub.restore()
  })

  describe('#getJoinableGames', () => {
    context('when call is successful', () => {
      before(async () => {
        axiosGetStub.withArgs(`${process.env.BASE_API}/boards`, {
          params: { type: 'joinable' }
        }).returns(new Promise((resolve) => {
          resolve({
            status: 200,
            data: boardsData
          })
        }))

        await actions.getJoinableGames(vuexContext)
      })

      it('makes a get request', () => {
        expect(axios.get).to.have.been.calledWith(`${process.env.BASE_API}/boards`, {
          params: { type: 'joinable' }
        })
      })

      it('commits the joinable games data', () => {
        expect(vuexContext.commit).to.have.been
          .calledWith(types.SET_JOINABLE_GAMES, boardsData)
      })
    })
  })

  describe('#createGame', () => {
    context('when opponent is another player', () => {
      const isOpponentAi = false

      before(async () => {
        axiosPostStub.withArgs(`${process.env.BASE_API}/boards`, {
          is_opponent_ai: isOpponentAi
        }).returns(new Promise((resolve) => {
          resolve({
            status: 200,
            data: boardsData
          })
        }))

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
      axiosPutStub.withArgs(`${process.env.BASE_API}/boards/${boardId}`)
        .returns(new Promise((resolve) => {
          resolve({
            status: 200,
            data: board
          })
        }))

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
