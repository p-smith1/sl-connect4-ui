<template>
  <div>
    <div>
      <button id="signOutButton" v-on:click="signOut()">Sign Out</button>
    </div>

    <div class="container" v-show="showPlayerVersus">
      <div class="control has-icons-left">
        <div class="select is-large">
          <select id="createGameDropdown" v-on:change="createGameVs">
            <option value="" selected>Create New Game</option>
            <option value="player">Player vs. Player</option>
            <option value="computer">Player vs. Computer</option>
          </select>
        </div>
        <span class="icon is-large is-left">
          <i class="fas fa-globe"></i>
        </span>
      </div>
    </div>

    <div id="joinableGames" v-if="showJoinableGames">
      <div v-for="joinableGame in joinableGames" :key="joinableGame.id">
        <span data-opponent-name>{{ joinableGame.primary_player.name }}</span>

        <button data-join-button v-on:click="handleJoinGame(joinableGame)">Join Game</button>
      </div>
    </div>

    <div class="container-difficulty" v-show="showDifficulty">
      <div class="difficulty-row">
        <img src="../assets/patrick-easy.png" class="thumbnail" alt="Patrick Easy" />
        <button id="easyDifficulty" class="button is-danger">
          <span class="has-text-weight-bold">Easy Peasy</span>
        </button>
      </div>

      <div class="difficulty-row">
        <img src="../assets/patrick-difficult.png" class="thumbnail" alt="Patrick Difficult" />
        <button id="hardDifficulty" class="button is-danger">
          <span class="has-text-weight-bold">Darkly Difficult</span>
        </button>
      </div>
    </div>

    <div class="container-connect4">
      <div id="waitingForPlayer" v-if="showWaitingForPlayer">
        <span>Waiting for Player...</span>
      </div>

      <div v-if="showConnect4">
        <div id="opponentInfo" class="container-opponent-info">
          <span id="opponentName">{{ currentOpponent.name }}</span>
        </div>

        <div class="control">
          <h4>AI Intelligence</h4>
          <label class="radio">
            <input id="weakIntelligence" type="radio" value="weak" checked="checked" v-model="aiIntelligence">
            Weak
          </label>
          <label class="radio">
            <input id="strongIntelligence" type="radio" value="strong" v-model="aiIntelligence">
            Strong
          </label>
        </div>

        <div id="connect4Grid">
          <div class="columns is-centered">
            <div id="c4-grid-0-5" v-on:click="addToken(0)" class="column is-narrow">
              <img :src="getToken(0, 5)" alt="Token" />
            </div>
            <div id="c4-grid-1-5" v-on:click="addToken(1)" class="column is-narrow">
              <img :src="getToken(1, 5)" alt="Token" />
            </div>
            <div id="c4-grid-2-5" v-on:click="addToken(2)" class="column is-narrow">
              <img :src="getToken(2, 5)" alt="Token" />
            </div>
            <div id="c4-grid-3-5" v-on:click="addToken(3)" class="column is-narrow">
              <img :src="getToken(3, 5)" alt="Token" />
            </div>
            <div id="c4-grid-4-5" v-on:click="addToken(4)" class="column is-narrow">
              <img :src="getToken(4, 5)" alt="Token" />
            </div>
            <div id="c4-grid-5-5" v-on:click="addToken(5)" class="column is-narrow">
              <img :src="getToken(5, 5)" alt="Token" />
            </div>
            <div id="c4-grid-6-5" v-on:click="addToken(6)" class="column is-narrow">
              <img :src="getToken(6, 5)" alt="Token" />
            </div>
          </div>
          <div class="columns is-centered">
            <div id="c4-grid-0-4" v-on:click="addToken(0)" class="column is-narrow">
              <img :src="getToken(0, 4)" alt="Token" />
            </div>
            <div id="c4-grid-1-4" v-on:click="addToken(1)" class="column is-narrow">
              <img :src="getToken(1, 4)" alt="Token" />
            </div>
            <div id="c4-grid-2-4" v-on:click="addToken(2)" class="column is-narrow">
              <img :src="getToken(2, 4)" alt="Token" />
            </div>
            <div id="c4-grid-3-4" v-on:click="addToken(3)" class="column is-narrow">
              <img :src="getToken(3, 4)" alt="Token" />
            </div>
            <div id="c4-grid-4-4" v-on:click="addToken(4)" class="column is-narrow">
              <img :src="getToken(4, 4)" alt="Token" />
            </div>
            <div id="c4-grid-5-4" v-on:click="addToken(5)" class="column is-narrow">
              <img :src="getToken(5, 4)" alt="Token" />
            </div>
            <div id="c4-grid-6-4" v-on:click="addToken(6)" class="column is-narrow">
              <img :src="getToken(6, 4)" alt="Token" />
            </div>
          </div>
          <div class="columns is-centered">
            <div id="c4-grid-0-3" v-on:click="addToken(0)" class="column is-narrow">
              <img :src="getToken(0, 3)" alt="Token" />
            </div>
            <div id="c4-grid-1-3" v-on:click="addToken(1)" class="column is-narrow">
              <img :src="getToken(1, 3)" alt="Token" />
            </div>
            <div id="c4-grid-2-3" v-on:click="addToken(2)" class="column is-narrow">
              <img :src="getToken(2, 3)" alt="Token" />
            </div>
            <div id="c4-grid-3-3" v-on:click="addToken(3)" class="column is-narrow">
              <img :src="getToken(3, 3)" alt="Token" />
            </div>
            <div id="c4-grid-4-3" v-on:click="addToken(4)" class="column is-narrow">
              <img :src="getToken(4, 3)" alt="Token" />
            </div>
            <div id="c4-grid-5-3" v-on:click="addToken(5)" class="column is-narrow">
              <img :src="getToken(5, 3)" alt="Token" />
            </div>
            <div id="c4-grid-6-3" v-on:click="addToken(6)" class="column is-narrow">
              <img :src="getToken(6, 3)" alt="Token" />
            </div>
          </div>
          <div class="columns is-centered">
            <div id="c4-grid-0-2" v-on:click="addToken(0)" class="column is-narrow">
              <img :src="getToken(0, 2)" alt="Token" />
            </div>
            <div id="c4-grid-1-2" v-on:click="addToken(1)" class="column is-narrow">
              <img :src="getToken(1, 2)" alt="Token" />
            </div>
            <div id="c4-grid-2-2" v-on:click="addToken(2)" class="column is-narrow">
              <img :src="getToken(2, 2)" alt="Token" />
            </div>
            <div id="c4-grid-3-2" v-on:click="addToken(3)" class="column is-narrow">
              <img :src="getToken(3, 2)" alt="Token" />
            </div>
            <div id="c4-grid-4-2" v-on:click="addToken(4)" class="column is-narrow">
              <img :src="getToken(4, 2)" alt="Token" />
            </div>
            <div id="c4-grid-5-2" v-on:click="addToken(5)" class="column is-narrow">
              <img :src="getToken(5, 2)" alt="Token" />
            </div>
            <div id="c4-grid-6-2" v-on:click="addToken(6)" class="column is-narrow">
              <img :src="getToken(6, 2)" alt="Token" />
            </div>
          </div>
          <div class="columns is-centered">
            <div id="c4-grid-0-1" v-on:click="addToken(0)" class="column is-narrow">
              <img :src="getToken(0, 1)" alt="Token" />
            </div>
            <div id="c4-grid-1-1" v-on:click="addToken(1)" class="column is-narrow">
              <img :src="getToken(1, 1)" alt="Token" />
            </div>
            <div id="c4-grid-2-1" v-on:click="addToken(2)" class="column is-narrow">
              <img :src="getToken(2, 1)" alt="Token" />
            </div>
            <div id="c4-grid-3-1" v-on:click="addToken(3)" class="column is-narrow">
              <img :src="getToken(3, 1)" alt="Token" />
            </div>
            <div id="c4-grid-4-1" v-on:click="addToken(4)" class="column is-narrow">
              <img :src="getToken(4, 1)" alt="Token" />
            </div>
            <div id="c4-grid-5-1" v-on:click="addToken(5)" class="column is-narrow">
              <img :src="getToken(5, 1)" alt="Token" />
            </div>
            <div id="c4-grid-6-1" v-on:click="addToken(6)" class="column is-narrow">
              <img :src="getToken(6, 1)" alt="Token" />
            </div>
          </div>
          <div class="columns is-centered">
            <div id="c4-grid-0-0" v-on:click="addToken(0)" class="column is-narrow">
              <img :src="getToken(0, 0)" alt="Token" />
            </div>
            <div id="c4-grid-1-0" v-on:click="addToken(1)" class="column is-narrow">
              <img :src="getToken(1, 0)" alt="Token" />
            </div>
            <div id="c4-grid-2-0" v-on:click="addToken(2)" class="column is-narrow">
              <img :src="getToken(2, 0)" alt="Token" />
            </div>
            <div id="c4-grid-3-0" v-on:click="addToken(3)" class="column is-narrow">
              <img :src="getToken(3, 0)" alt="Token" />
            </div>
            <div id="c4-grid-4-0" v-on:click="addToken(4)" class="column is-narrow">
              <img :src="getToken(4, 0)" alt="Token" />
            </div>
            <div id="c4-grid-5-0" v-on:click="addToken(5)" class="column is-narrow">
              <img :src="getToken(5, 0)" alt="Token" />
            </div>
            <div id="c4-grid-6-0" v-on:click="addToken(6)" class="column is-narrow">
              <img :src="getToken(6, 0)" alt="Token" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import channels from '@/channels'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import redToken from '@/assets/red-token.png'
import blueToken from '@/assets/blue-token.png'
import noToken from '@/assets/no-token.png'

export default {
  name: 'Dashboard',
  data () {
    return {
      showPlayerVersus: true,
      showDifficulty: false,
      showJoinableGames: true,
      createGameSelection: '',
      aiIntelligence: 'weak'
    }
  },
  mounted: function () {
    this.getCurrentUser()
    this.getJoinableGames()

    channels.getAvailableGamesChannel()
  },
  computed: {
    ...mapGetters('game', {
      currentGame: 'getCurrentGame',
      joinableGames: 'getJoinableGames'
    }),

    ...mapGetters('user', {
      currentUser: 'getCurrentUser',
      currentOpponent: 'getCurrentOpponent'
    }),

    showWaitingForPlayer: function () {
      return (
        !!this.currentGame &&
        !this.currentGame.secondary_player_id &&
        !this.currentGame.is_opponent_ai
      )
    },

    showConnect4: function () {
      return !!this.currentOpponent
    }
  },
  methods: {
    ...mapActions('game', [
      'createGame',
      'getJoinableGames',
      'joinGame'
    ]),

    ...mapActions('user', [
      'getCurrentUser',
      'logout'
    ]),

    ...mapMutations('user', [
      'SET_CURRENT_OPPONENT'
    ]),

    hasToken: function (col, row) {
      const board = this.currentGame.board
      const tokenValue = board[col][row]

      return (tokenValue === 0)
    },

    handleJoinGame: function (board) {
      this.showJoinableGames = false

      this.joinGame({ board, userId: this.currentUser.id })
      this.SET_CURRENT_OPPONENT(board.primary_player)
    },

    addToken: function (col) {
      const channel = channels.getPlayGameChannel(this.currentGame.id)
      channel.send({
        board_id: this.currentGame.id,
        column_index: col,
        ai_intelligence: this.aiIntelligence
      })
    },

    getToken: function (col, row) {
      let result = null

      const board = this.currentGame.board

      switch (board[col][row]) {
        case 1:
          result = redToken
          break
        case 2:
          result = blueToken
          break
        default:
          result = noToken
          break
      }

      return result
    },

    createGameVs: function (e) {
      switch (e.target.value) {
        case 'player':
          this.createGame({ isOpponentAi: false }).then(() => {
            channels.getPlayGameChannel(this.currentGame.id)
          })
          break
        case 'computer':
          this.createGame({ isOpponentAi: true }).then(() => {
            channels.getPlayGameChannel(this.currentGame.id)
            this.SET_CURRENT_OPPONENT({
              id: 0,
              email: 'ai@sl-connect4.com',
              name: 'Arty Intel'
            })
          })
          break
        default:
          break
      }
    },

    generateGrid: function () {
      this.showConnect4Grid = true
    },

    sendWebsocketMsg: function () {
      channels.gamePlayChannel.send({ board_id: 2, column_index: 0 })
    },

    signOut: function () {
      this.logout().then(() => {
        this.$router.push({ name: 'Home' })
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.column {
  border: 1px dashed black;
  width: 100px;
  height: 100px;
}

.container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.container-difficulty {
  display: flex;
  align-items: center;
  justify-content: center;
}

.container-opponent-info {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.difficulty-row {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0px 40px
}

.thumbnail {
  width: 300px;
  margin-bottom: 10px;
}

button {
  width: 200px;
}
</style>
