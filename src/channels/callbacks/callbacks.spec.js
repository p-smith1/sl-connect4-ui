import callbacks from './'
import store from '@/store'
import types from '@/store/modules/game/mutations/types'

describe('Channels: Callbacks', () => {
  let storeCommitStub
  let storeDispatchStub
  let sandbox

  before(() => {
    sandbox = sinon.createSandbox({})
    storeCommitStub = sinon.stub(store, 'commit')
    storeDispatchStub = sinon.stub(store, 'dispatch')
  })

  after(() => {
    storeCommitStub.restore()
    storeDispatchStub.restore()
  })

  describe('#availableGamesChannel', () => {
    describe('#received', () => {
      context('when receiving a joinable game', () => {
        const joinableGameMsg = {
          is_joinable: true,
          game: {
            id: 4
          }
        }

        before(() => {
          callbacks.availableGamesChannel.received(joinableGameMsg)
        })

        it('commits joinable game to state', () => {
          expect(store.commit).to.have.been
            .calledWith(`game/${types.ADD_JOINABLE_GAME}`, joinableGameMsg.game)
        })
      })

      context('when receiving a non-joinable game', () => {
        context('when current game is waiting for opponent', () => {
          const currentGame = {
            id: 43,
            secondary_player_id: null,
            is_opponent_ai: false
          }

          before(() => {
            sandbox.stub(store, 'state').value({
              game: { currentGame }
            })
          })

          after(() => sandbox.restore())

          context('when non-joinable game is current game', () => {
            const secondaryPlayerId = 33
            const nonJoinableGameMsg = {
              is_joinable: false,
              game: {
                id: currentGame.id,
                secondary_player_id: secondaryPlayerId,
                is_opponent_ai: currentGame.is_opponent_ai
              }
            }

            before(() => {
              callbacks.availableGamesChannel.received(nonJoinableGameMsg)
            })

            it('commits non-joinable game to state', () => {
              expect(store.commit).to.have.been
                .calledWith(`game/${types.REMOVE_JOINABLE_GAME}`, nonJoinableGameMsg.game)
            })

            it('commits the game to current game', () => {
              expect(store.commit).to.have.been
                .calledWith(`game/${types.SET_CURRENT_GAME}`, nonJoinableGameMsg.game)
            })

            it('dispatches action to get opponent', () => {
              expect(store.dispatch).to.have.been.calledWith(`user/getCurrentOpponent`, {
                userId: secondaryPlayerId
              })
            })
          })

          context('when non-joinable game is not current game', () => {
            const nonJoinableGameMsg = {
              is_joinable: false,
              game: {
                id: 42,
                secondary_player_id: null,
                is_opponent_ai: false
              }
            }

            before(() => {
              callbacks.availableGamesChannel.received(nonJoinableGameMsg)
            })

            it('commits non-joinable game to state', () => {
              expect(store.commit).to.have.been
                .calledWith(`game/${types.REMOVE_JOINABLE_GAME}`, nonJoinableGameMsg.game)
            })

            it('does not commits the game to current game', () => {
              expect(store.commit).not.to.have.been
                .calledWith(`game/${types.SET_CURRENT_GAME}`, nonJoinableGameMsg.game)
            })
          })
        })

        context('when no current game exists', () => {
          const nonJoinableGameMsg = {
            is_joinable: false,
            game: {
              id: 4
            }
          }

          before(() => {
            callbacks.availableGamesChannel.received(nonJoinableGameMsg)
          })

          it('commits non-joinable game to state', () => {
            expect(store.commit).to.have.been
              .calledWith(`game/${types.REMOVE_JOINABLE_GAME}`, nonJoinableGameMsg.game)
          })
        })
      })
    })
  })

  describe('#playGameChannel', () => {
    describe('#received', () => {
      context('when move was made by player', () => {
        const playerId = 20
        const columnIndex = 3
        const gamePlayMsg = {
          move_type: 'valid_move',
          played_by: { id: playerId },
          column_index: 3
        }

        context('when move type is valid_move', () => {
          before(() => {
            storeCommitStub.resetHistory()
            gamePlayMsg.move_type = 'valid_move'

            callbacks.playGameChannel.received(gamePlayMsg)
          })

          it('commits the move to state', () => {
            expect(store.commit).to.have.been
              .calledWith(`game/${types.SET_GAME_COLUMN}`, {columnIndex, playerId})
          })
        })

        context('when move type is invalid_move', () => {
          before(() => {
            storeCommitStub.resetHistory()
            gamePlayMsg.move_type = 'invalid_move'

            callbacks.playGameChannel.received(gamePlayMsg)
          })

          it('commits nothing', () => {
            expect(store.commit).not.to.have.been.called
          })
        })

        context('when move type is winning_move', () => {
          before(() => {
            storeCommitStub.resetHistory()
            gamePlayMsg.move_type = 'winning_move'

            callbacks.playGameChannel.received(gamePlayMsg)
          })

          it('commits the move to state', () => {
            expect(store.commit).to.have.been
              .calledWith(`game/${types.SET_GAME_COLUMN}`, {columnIndex, playerId})
          })

          it('commits the win to state', () => {
            expect(store.commit).to.have.been
              .calledWith(`game/${types.SET_GAME_WINNER}`, {playerId})
          })
        })

        context('when move type is tie_move', () => {
          before(() => {
            storeCommitStub.resetHistory()
            gamePlayMsg.move_type = 'tie_move'

            callbacks.playGameChannel.received(gamePlayMsg)
          })

          it('commits the move to state', () => {
            expect(store.commit).to.have.been
              .calledWith(`game/${types.SET_GAME_COLUMN}`, {columnIndex, playerId})
          })

          it('commits the win to state', () => {
            expect(store.commit).to.have.been
              .calledWith(`game/${types.SET_GAME_TIE}`)
          })
        })
      })

      context('when move was made by ai', () => {
        const playerId = 0
        const columnIndex = 3
        const gamePlayMsg = {
          move_type: 'valid_move',
          played_by: null,
          column_index: 3
        }

        context('when move type is valid_move', () => {
          before(() => {
            storeCommitStub.resetHistory()
            gamePlayMsg.move_type = 'valid_move'

            callbacks.playGameChannel.received(gamePlayMsg)
          })

          it('commits the move to state', () => {
            expect(store.commit).to.have.been
              .calledWith(`game/${types.SET_GAME_COLUMN}`, {columnIndex, playerId})
          })
        })

        context('when move type is winning_move', () => {
          before(() => {
            storeCommitStub.resetHistory()
            gamePlayMsg.move_type = 'winning_move'

            callbacks.playGameChannel.received(gamePlayMsg)
          })

          it('commits the move to state', () => {
            expect(store.commit).to.have.been
              .calledWith(`game/${types.SET_GAME_COLUMN}`, {columnIndex, playerId})
          })

          it('commits the win to state', () => {
            expect(store.commit).to.have.been
              .calledWith(`game/${types.SET_GAME_WINNER}`, {playerId})
          })
        })
      })
    })
  })
})
