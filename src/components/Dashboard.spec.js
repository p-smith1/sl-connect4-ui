import Dashboard from './Dashboard'
import Vuex from 'vuex'
import { createLocalVue, shallow } from '@vue/test-utils'
import gameActions from '@/store/modules/game/actions'
import gameMutations from '@/store/modules/game/mutations'
import gameGetters from '@/store/modules/game/getters'
import userActions from '@/store/modules/user/actions'
import userMutations from '@/store/modules/user/mutations'
import moxios from 'moxios'

describe('Component: Dashboard', () => {
  const localVue = createLocalVue()

  let component
  let store
  let createGameSpy
  let getCurrentSpy

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

  const createdBoard = {
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

  before((done) => {
    const mockUserModule = {
      namespaced: true,
      actions: userActions,
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

    moxios.install()

    createGameSpy = sinon.spy(gameActions, 'createGame')
    getCurrentSpy = sinon.spy(userActions, 'getCurrent')

    store = new Vuex.Store({
      modules: {
        user: mockUserModule,
        game: mockGameModule
      }
    })

    moxios.wait(() => {
      const request = moxios.requests.mostRecent()

      request.respondWith({
        status: 200,
        response: currentUser
      })

      done()
    })

    component = generateComponent()
  })

  after(() => {
    moxios.uninstall()
    createGameSpy.restore()
    getCurrentSpy.restore()
  })

  function generateComponent () {
    return shallow(Dashboard, {
      localVue,
      store
    })
  }

  it('calls action to retrieve user profile', () => {
    expect(userActions.getCurrent).to.have.been.called
  })

  context('when user clicks to start a new game', () => {
    context('when user clicks to play against player', () => {
      const isOpponentAi = false

      before((done) => {
        const createGameDropdown = component.find('#createGameDropdown')
        const createGameOptions = createGameDropdown.findAll('option')

        createGameDropdown.trigger('click')
        const vsPlayerOption = createGameOptions.at(1)

        vsPlayerOption.trigger('click')

        moxios.wait(() => {
          const request = moxios.requests.mostRecent()

          request.respondWith({
            status: 201,
            response: createdBoard
          })

          done()
        })
      })

      after(() => {
        component = generateComponent()
      })

      it('calls action to create board', () => {
        expect(gameActions.createGame).to.have.been.calledWith(sinon.match.any, {isOpponentAi})
      })

      it('shows user message waiting for other player', () => {
        const waitingForPlayer = component.find('#waitingForPlayer')

        expect(waitingForPlayer.element).not.to.be.undefined
      })

      context('when another player joins the game', () => {
        before((done) => {
          moxios.wait(() => {
            const request = moxios.requests.mostRecent()

            request.respondWith({
              status: 204,
              response: {}
            })

            localVue.nextTick(done)
          })

          store.dispatch('game/joinGame', {board: createdBoard, userId: opponentUser.id})
        })

        it('hides message waiting for other player', () => {
          const waitingForPlayer = component.find('#waitingForPlayer')

          expect(waitingForPlayer.element).to.be.undefined
        })
      })
    })

    context('when user clicks to play against computer', () => {
      before(() => {
        const createGameDropdown = component.find('#createGameDropdown')
        const createGameOptions = createGameDropdown.findAll('option')

        createGameDropdown.trigger('click')
        const vsComputerOption = createGameOptions.at(2)

        vsComputerOption.trigger('click')
      })

      it('shows user a new connect four board', () => {
        let connect4Grid = component.find('#connect4Grid')

        expect(connect4Grid.element).not.to.be.undefined
      })
    })
  })
})
