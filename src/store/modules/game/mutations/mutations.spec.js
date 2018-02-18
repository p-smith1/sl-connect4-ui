import mutations from './'

describe('Game Module: Mutations', () => {
  describe('#SET_CURRENT_GAME', () => {
    let state = {}
    let game = { id: 2 }

    before(() => {
      mutations.SET_CURRENT_GAME(state, game)
    })

    it('sets the state of the currentGame object', () => {
      expect(state.currentGame).to.equal(game)
    })
  })

  describe('#SET_GAME_COLUMN', () => {
    context('when current game is set', () => {
      const columnIndex = 5
      const primaryPlayerId = 22
      const secondaryPlayerId = 23
      const game = {
        id: 2,
        move_count: 10,
        primary_player_id: 22,
        secondary_player_id: 23,
        column_heights: [6, 1, 1, 0, 0, 1, 1],
        board: [
          [1, 2, 1, 2, 1, 2],
          [1, 0, 0, 0, 0, 0],
          [1, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0],
          [2, 0, 0, 0, 0, 0],
          [2, 0, 0, 0, 0, 0]
        ]
      }

      let state = {
        currentGame: game
      }

      context('when move is made by primary player', () => {
        before(() => {
          mutations.SET_GAME_COLUMN(state, {columnIndex, playerId: primaryPlayerId})
        })

        it('updates the move count', () => {
          expect(state.currentGame.move_count).to.equal(11)
        })

        it('updates the column heights', () => {
          expect(state.currentGame.column_heights)
            .to.deep.equal([6, 1, 1, 0, 0, 2, 1])
        })

        it('updates the board', () => {
          expect(state.currentGame.board)
            .to.deep.equal([
              [1, 2, 1, 2, 1, 2],
              [1, 0, 0, 0, 0, 0],
              [1, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0],
              [2, 1, 0, 0, 0, 0],
              [2, 0, 0, 0, 0, 0]
            ])
        })
      })

      context('when move is made by secondary player', () => {
        before(() => {
          mutations.SET_GAME_COLUMN(state, {columnIndex, playerId: secondaryPlayerId})
        })

        it('updates the move count', () => {
          expect(state.currentGame.move_count).to.equal(12)
        })

        it('updates the column heights', () => {
          expect(state.currentGame.column_heights)
            .to.deep.equal([6, 1, 1, 0, 0, 3, 1])
        })

        it('updates the board', () => {
          expect(state.currentGame.board)
            .to.deep.equal([
              [1, 2, 1, 2, 1, 2],
              [1, 0, 0, 0, 0, 0],
              [1, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0],
              [2, 1, 2, 0, 0, 0],
              [2, 0, 0, 0, 0, 0]
            ])
        })
      })
    })

    context('when current game is not set', () => {
      const columnIndex = 5
      const primaryPlayerId = 22

      let state = {}

      before(() => {
        mutations.SET_GAME_COLUMN(state, {columnIndex, playerId: primaryPlayerId})
      })

      it('does not modify state', () => {
        expect(state).to.deep.equal({})
      })
    })
  })

  describe('#SET_GAME_TIE', () => {
    const columnIndex = 5
    const primaryPlayerId = 22
    const secondaryPlayerId = 23
    const game = {
      id: 2,
      primary_player_id: primaryPlayerId,
      secondary_player_id: secondaryPlayerId,
      winner_id: null,
      loser_id: null,
      is_game_over: false
    }

    let state = { currentGame: game }

    before(() => {
      mutations.SET_GAME_WINNER(state, {columnIndex, playerId: primaryPlayerId})
    })

    it('sets game over', () => {
      expect(state.currentGame.is_game_over).to.be.true
    })
  })

  describe('#SET_GAME_WINNER', () => {
    context('when primary player is winner', () => {
      const columnIndex = 5
      const primaryPlayerId = 22
      const secondaryPlayerId = 23
      const game = {
        id: 2,
        primary_player_id: primaryPlayerId,
        secondary_player_id: secondaryPlayerId,
        winner_id: null,
        loser_id: null,
        is_game_over: false
      }

      let state = { currentGame: game }

      before(() => {
        mutations.SET_GAME_WINNER(state, {columnIndex, playerId: primaryPlayerId})
      })

      it('sets game over', () => {
        expect(state.currentGame.is_game_over).to.be.true
      })

      it('sets the winner', () => {
        expect(state.currentGame.winner_id).to.equal(primaryPlayerId)
      })

      it('sets the loser', () => {
        expect(state.currentGame.loser_id).to.equal(secondaryPlayerId)
      })
    })

    context('when secondary player is winner', () => {
      const columnIndex = 5
      const primaryPlayerId = 22
      const secondaryPlayerId = 23
      const game = {
        id: 2,
        primary_player_id: primaryPlayerId,
        secondary_player_id: secondaryPlayerId,
        winner_id: null,
        loser_id: null,
        is_game_over: false
      }

      let state = { currentGame: game }

      before(() => {
        mutations.SET_GAME_WINNER(state, {columnIndex, playerId: secondaryPlayerId})
      })

      it('sets game over', () => {
        expect(state.currentGame.is_game_over).to.be.true
      })

      it('sets the winner', () => {
        expect(state.currentGame.winner_id).to.equal(secondaryPlayerId)
      })

      it('sets the loser', () => {
        expect(state.currentGame.loser_id).to.equal(primaryPlayerId)
      })
    })
  })

  describe('#SET_JOINABLE_GAMES', () => {
    let state = {}
    let joinableGames = [ 'fizz', 'buzz', 'foo', 'bar' ]

    before(() => {
      mutations.SET_JOINABLE_GAMES(state, joinableGames)
    })

    it('sets the state of the joinableGames object', () => {
      expect(state.joinableGames).to.equal(joinableGames)
    })
  })

  describe('#ADD_JOINABLE_GAME', () => {
    let state = {
      joinableGames: [ 'fizz', 'buzz', 'foo', 'bar' ]
    }

    let newJoinableGame = 'dizzy'

    before(() => {
      mutations.ADD_JOINABLE_GAME(state, newJoinableGame)
    })

    it('sets the state of the joinableGames object', () => {
      expect(state.joinableGames.length).to.equal(5)
      expect(state.joinableGames[4]).to.equal(newJoinableGame)
    })
  })

  describe('#REMOVE_JOINABLE_GAME', () => {
    let state = {
      joinableGames: [ { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 } ]
    }

    let nonJoinableGame = { id: 2 }

    before(() => {
      mutations.REMOVE_JOINABLE_GAME(state, nonJoinableGame)
    })

    it('sets the state of the joinableGames object', () => {
      expect(state.joinableGames.length).to.equal(3)
      expect(state.joinableGames[1].id).not.to.equal(nonJoinableGame.id)
    })
  })
})
