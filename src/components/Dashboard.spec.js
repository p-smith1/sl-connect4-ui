import Dashboard from './Dashboard'
import Vue from 'vue'
import Vuex from 'vuex'
import GoogleAuth from 'vue-google-auth'
import { createLocalVue, shallow } from '@vue/test-utils'
import gameActions from '@/store/modules/game/actions'
import gameMutations from '@/store/modules/game/mutations'
import gameTypes from '@/store/modules/game/mutations/types'
import gameGetters from '@/store/modules/game/getters'
import userActions from '@/store/modules/user/actions'
import userGetters from '@/store/modules/user/getters'
import userMutations from '@/store/modules/user/mutations'
import redToken from '@/assets/red-token.png'
import axios from 'axios'
import channels from '@/channels'

describe('Component: Dashboard', () => {
  const localVue = createLocalVue()

  let component
  let store
  let $router

  let createGameSpy
  let getCurrentUserSpy
  let getJoinableGamesSpy
  let joinGameSpy
  let setCurrentOpponentSpy
  let logoutSpy

  let axiosGetStub
  let axiosPostStub
  let axiosPutStub
  let googleAuthStub
  let signOutStub
  let availableGamesChannelStub
  let playGameChannelStub
  let playGameChannelSendSpy

  const currentUser = {
    id: 1,
    google_id: 123456789,
    email: 'nobody@nowhere.com',
    name: 'John Doe'
  }

  const opponentUser = {
    id: 2,
    google_id: 987654321,
    email: 'yesbody@yeswhere.com',
    name: 'Jane Smith'
  }

  const createdPlayerBoard = {
    id: 1,
    primary_player_id: currentUser.id,
    secondary_player_id: null,
    current_player_id: null,
    winner_id: null,
    loser_id: null,
    is_opponent_ai: false,
    is_game_over: false,
    move_count: 0,
    column_heights: [0, 0, 0, 0, 0, 0, 0],
    board: [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0]
    ]
  }

  const createdAiBoard = {
    id: 1,
    primary_player_id: currentUser.id,
    secondary_player_id: null,
    current_player_id: currentUser.id,
    winner_id: null,
    loser_id: null,
    is_opponent_ai: true,
    is_game_over: false,
    move_count: 0,
    column_heights: [0, 0, 0, 0, 0, 0, 0],
    board: [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0]
    ]
  }

  const joinableBoards = [
    {
      id: 100,
      primary_player_id: 200,
      primary_player: {
        id: 200,
        name: 'John Doe'
      },
      secondary_player_id: null,
      current_player_id: null,
      winner_id: null,
      loser_id: null,
      is_opponent_ai: false,
      is_game_over: false,
      move_count: 0,
      column_heights: [0, 0, 0, 0, 0, 0, 0],
      board: [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
      ]
    },
    {
      id: 101,
      primary_player_id: 201,
      primary_player: {
        id: 201,
        name: 'Jane Smith'
      },
      secondary_player_id: null,
      current_player_id: null,
      winner_id: null,
      loser_id: null,
      is_opponent_ai: false,
      is_game_over: false,
      move_count: 0,
      column_heights: [0, 0, 0, 0, 0, 0, 0],
      board: [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
      ]
    },
    {
      id: 102,
      primary_player_id: 202,
      primary_player: {
        id: 202,
        name: 'John Jackson'
      },
      secondary_player_id: null,
      current_player_id: null,
      winner_id: null,
      loser_id: null,
      is_opponent_ai: false,
      is_game_over: false,
      move_count: 0,
      column_heights: [0, 0, 0, 0, 0, 0, 0],
      board: [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
      ]
    }
  ]

  before((done) => {
    Vue.use(GoogleAuth, { clientId: 'foobar' })

    googleAuthStub = sinon.stub(Vue, 'googleAuth')
    signOutStub = sinon.stub()

    googleAuthStub.callsFake(() => {
      return {
        signOut: signOutStub
      }
    })

    axiosGetStub = sinon.stub(axios, 'get')
    axiosPostStub = sinon.stub(axios, 'post')
    axiosPutStub = sinon.stub(axios, 'put')

    availableGamesChannelStub = sinon.stub(channels, 'getAvailableGamesChannel')

    playGameChannelSendSpy = sinon.spy()
    playGameChannelStub = sinon.stub(channels, 'getPlayGameChannel').returns({
      send: playGameChannelSendSpy
    })

    axiosGetStub.withArgs(`${process.env.BASE_API}/users/current`)
      .returns(new Promise((resolve) => {
        resolve({
          status: 200,
          data: currentUser
        })
      }))

    axiosGetStub.withArgs(`${process.env.BASE_API}/boards`, {
      params: { type: 'joinable' }
    }).returns(new Promise((resolve) => {
      resolve({
        status: 200,
        data: joinableBoards
      })
    }))

    createGameSpy = sinon.spy(gameActions, 'createGame')
    getJoinableGamesSpy = sinon.spy(gameActions, 'getJoinableGames')
    joinGameSpy = sinon.spy(gameActions, 'joinGame')
    getCurrentUserSpy = sinon.spy(userActions, 'getCurrentUser')
    logoutSpy = sinon.spy(userActions, 'logout')
    setCurrentOpponentSpy = sinon.spy(userMutations, 'SET_CURRENT_OPPONENT')

    $router = {
      push: sinon.spy()
    }

    component = generateComponent()
    localVue.nextTick(done)
  })

  after(() => {
    createGameSpy.restore()
    getJoinableGamesSpy.restore()
    joinGameSpy.restore()
    getCurrentUserSpy.restore()
    logoutSpy.restore()
    setCurrentOpponentSpy.restore()

    axiosGetStub.restore()
    axiosPostStub.restore()
    axiosPutStub.restore()
    googleAuthStub.restore()

    availableGamesChannelStub.restore()
    playGameChannelStub.restore()
  })

  function generateComponent () {
    const mockUserModule = {
      namespaced: true,
      actions: userActions,
      getters: userGetters,
      mutations: userMutations,
      state: {}
    }

    const mockGameModule = {
      namespaced: true,
      actions: gameActions,
      getters: gameGetters,
      mutations: gameMutations,
      state: {}
    }

    store = new Vuex.Store({
      modules: {
        user: mockUserModule,
        game: mockGameModule
      }
    })

    return shallow(Dashboard, {
      localVue,
      mocks: {
        $router
      },
      store
    })
  }

  describe('mounted', () => {
    it('calls action to retrieve user profile', () => {
      expect(userActions.getCurrentUser).to.have.been.called
    })

    it('calls action to get joinable boards', () => {
      expect(gameActions.getJoinableGames).to.have.been.called
    })

    it('subscribes to available games channel', () => {
      expect(channels.getAvailableGamesChannel).to.have.been.called
    })

    it('shows the user potential games to join', () => {
      const joinableGames = component.findAll('#joinableGames > div')
      const joinableGame = joinableGames.at(0)
      const opponentName = joinableGame.find('[data-opponent-name]')

      expect(joinableGames.length).to.equal(joinableBoards.length)
      expect(opponentName.element.innerText).to
        .equal(joinableBoards[0].primary_player.name)
    })
  })

  context('when user clicks to sign out', () => {
    before((done) => {
      signOutStub.callsFake((resolve, reject) => {
        resolve()
      })

      const signOutButton = component.find('#signOutButton')

      signOutButton.trigger('click')
      localVue.nextTick(done)
    })

    after((done) => {
      component = generateComponent()
      localVue.nextTick(done)
    })

    it('calls action to sign out', () => {
      expect(userActions.logout).to.have.been.called
    })

    it('routes user to the home page', () => {
      expect($router.push).to.have.been.calledWith({ name: 'Home' })
    })
  })

  context('when user clicks to join game', () => {
    const joinableBoard = joinableBoards[0]

    before((done) => {
      axiosPutStub.withArgs(`${process.env.BASE_API}/boards/${joinableBoard.id}`, {
        secondary_player_id: currentUser.id
      }).returns(new Promise((resolve) => {
        resolve({ status: 204, data: {} })
      }))

      const joinableGames = component.findAll('#joinableGames > div')
      const joinableGame = joinableGames.at(0)
      const joinButton = joinableGame.find('[data-join-button]')

      joinButton.trigger('click')

      localVue.nextTick(done)
    })

    after(() => {
      component = generateComponent()
    })

    it('hides joinable games', () => {
      const joinableGames = component.find('#joinableGames')

      expect(joinableGames.element).to.be.undefined
    })

    it('calls the action to join game', () => {
      expect(gameActions.joinGame).to.have.been.calledWith(sinon.match.any, {
        board: joinableBoard,
        userId: currentUser.id
      })
    })

    it('sets the current opponent', () => {
      expect(store.state.user.currentOpponent)
        .to.deep.equal(joinableBoard.primary_player)
    })

    it('shows opponent information', () => {
      const opponentInfo = component.find('#opponentInfo')
      const opponentName = component.find('#opponentName').element

      expect(opponentInfo.element).not.to.be.undefined
      expect(opponentName.innerText).to.equal(joinableBoard.primary_player.name)
    })

    it('shows the connect 4 board', () => {
      const connect4Grid = component.find('#connect4Grid')
      const rows = connect4Grid.findAll('#connect4Grid > div')
      const columns = rows.at(0).findAll('#connect4Grid > div > div')

      expect(connect4Grid.element).not.to.be.undefined
      expect(rows.length).to.equal(6)
      expect(columns.length).to.equal(7)
    })
  })

  context('when user clicks to start a new game', () => {
    context('when user clicks to play against player', () => {
      const isOpponentAi = false

      before((done) => {
        const createGameDropdown = component.find('#createGameDropdown')
        const createGameOptions = createGameDropdown.findAll('option')

        axiosPostStub.withArgs(`${process.env.BASE_API}/boards`, { is_opponent_ai: false })
          .returns(new Promise((resolve, reject) => {
            resolve({
              status: 201,
              data: createdPlayerBoard
            })
          }))

        createGameDropdown.trigger('click')
        const vsPlayerOption = createGameOptions.at(1)

        vsPlayerOption.trigger('change')

        localVue.nextTick(done)
      })

      after((done) => {
        component = generateComponent()
        localVue.nextTick(done)
      })

      it('calls action to create board', () => {
        expect(gameActions.createGame).to.have.been
          .calledWith(sinon.match.any, {isOpponentAi})
      })

      it('subscribes to game play channel', () => {
        expect(channels.getPlayGameChannel).to.have.been
          .calledWith(createdPlayerBoard.id)
      })

      it('shows user message waiting for other player', () => {
        const waitingForPlayer = component.find('#waitingForPlayer')

        expect(waitingForPlayer.element).not.to.be.undefined
      })

      it('hides opponent information', () => {
        const opponentInfo = component.find('#opponentInfo')

        expect(opponentInfo.element).to.be.undefined
      })

      context('when another player joins the game', () => {
        before((done) => {
          axiosPutStub.withArgs(`${process.env.BASE_API}/boards/${createdPlayerBoard.id}`, {
            secondary_player_id: opponentUser.id
          }).returns(new Promise((resolve, reject) => {
            resolve({
              status: 204,
              data: {}
            })
          }))

          axiosGetStub.withArgs(`${process.env.BASE_API}/users/${opponentUser.id}`)
            .returns(new Promise((resolve, reject) => {
              resolve({
                status: 200,
                data: opponentUser
              })
            }))

          store.dispatch('game/joinGame', {board: createdPlayerBoard, userId: opponentUser.id})
            .then(() => {
              store.dispatch('user/getCurrentOpponent', {userId: opponentUser.id})
                .then(() => {
                  done()
                })
            })
        })

        it('hides message waiting for other player', () => {
          const waitingForPlayer = component.find('#waitingForPlayer')

          expect(waitingForPlayer.element).to.be.undefined
        })

        it('shows opponent information', () => {
          const opponentInfo = component.find('#opponentInfo')
          const opponentName = component.find('#opponentName').element

          expect(opponentInfo.element).not.to.be.undefined
          expect(opponentName.innerText).to.equal(opponentUser.name)
        })

        it('shows the connect 4 board', () => {
          const connect4Grid = component.find('#connect4Grid')
          const rows = connect4Grid.findAll('#connect4Grid > div')
          const columns = rows.at(0).findAll('#connect4Grid > div > div')

          expect(connect4Grid.element).not.to.be.undefined
          expect(rows.length).to.equal(6)
          expect(columns.length).to.equal(7)
        })

        // context('when user clicks somewhere on connect 4 grid', () => {
        //   context('when user clicks on first column', () => {
        //     before(() => {
        //       const rows = component.findAll('#connect4Grid > div')
        //       const columns = rows.at(0).findAll('#connect4Grid > div > div')

        //       columns.at(0).trigger('click')
        //     })

        //     it('adds a token to column', () => {
        //       const token = component.find('#c4-grid-0-0 > img')

        //       expect(token.element.src).to.equal(redToken)
        //     })
        //   })
        // })
      })
    })

    context('when user clicks to play against computer', () => {
      const isOpponentAi = true

      before((done) => {
        createGameSpy.resetHistory()

        axiosPostStub.withArgs(`${process.env.BASE_API}/boards`, { is_opponent_ai: true })
          .returns(new Promise((resolve, reject) => {
            resolve({
              status: 201,
              data: createdAiBoard
            })
          }))

        const createGameDropdown = component.find('#createGameDropdown')
        const createGameOptions = createGameDropdown.findAll('option')

        createGameDropdown.trigger('click')
        const vsComputerOption = createGameOptions.at(2)

        vsComputerOption.trigger('change')

        localVue.nextTick(done)
      })

      it('calls action to create board', () => {
        expect(gameActions.createGame).to.have.been
          .calledWith(sinon.match.any, {isOpponentAi})
      })

      it('subscribes to game play channel', () => {
        expect(channels.getPlayGameChannel).to.have.been
          .calledWith(createdPlayerBoard.id)
      })

      it('sets the current opponent to ai', () => {
        expect(userMutations.SET_CURRENT_OPPONENT).to.have.been
          .calledWith(sinon.match.any, {
            id: 0,
            email: 'ai@sl-connect4.com',
            name: 'Arty Intel'
          })
      })

      it('does not show waiting for player', () => {
        const waitingForPlayer = component.find('#waitingForPlayer')

        expect(waitingForPlayer.element).to.be.undefined
      })

      it('shows user a new connect four board', () => {
        let connect4Grid = component.find('#connect4Grid')

        expect(connect4Grid.element).not.to.be.undefined
      })

      context('when user clicks the weak intelligence for ai', () => {
        before(() => {
          let weakIntelligence = component.find('#weakIntelligence')

          weakIntelligence.trigger('click')
        })

        context('when user clicks somewhere on connect 4 grid', () => {
          context('when user clicks on first column', () => {
            before(() => {
              const rows = component.findAll('#connect4Grid > div')
              const columns = rows.at(rows.length - 1).findAll('#connect4Grid > div > div')

              columns.at(0).trigger('click')
            })

            it('sends a message to the game play channel', () => {
              expect(playGameChannelSendSpy).to.have.been.calledWith({
                board_id: createdAiBoard.id,
                column_index: 0,
                ai_intelligence: 'weak'
              })
            })

            context('when play game channel responds to move as valid', () => {
              before(() => {
                store.commit(`game/${gameTypes.SET_GAME_COLUMN}`, {
                  columnIndex: 0,
                  playerId: currentUser.id
                })

                component.update()
              })

              it('updates the column with move', () => {
                const token = component.find('#c4-grid-0-0 > img')

                expect(token.element.src).to.include(redToken)
              })
            })
          })
        })
      })
    })
  })
})
