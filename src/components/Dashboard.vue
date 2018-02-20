<template>
  <div>
    <div class="container" v-show="showPlayerVersus">
      <div class="control has-icons-left">
        <div class="select is-large">
          <select id="createGameDropdown">
            <option selected>Create New Game</option>
            <option v-on:click="createGameVsPlayer()">Player vs. Player</option>
            <option v-on:click="generateGrid()">Player vs. Computer</option>
          </select>
        </div>
        <span class="icon is-large is-left">
          <i class="fas fa-globe"></i>
        </span>
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

      <div id="connect4Grid" v-if="showConnect4Grid">
        <div class="columns is-centered">
          <div id="c4-grid-0-5" class="column is-narrow"></div>
          <div id="c4-grid-1-5" class="column is-narrow"></div>
          <div id="c4-grid-2-5" class="column is-narrow"></div>
          <div id="c4-grid-3-5" class="column is-narrow"></div>
          <div id="c4-grid-4-5" class="column is-narrow"></div>
          <div id="c4-grid-5-5" class="column is-narrow"></div>
          <div id="c4-grid-6-5" class="column is-narrow"></div>
        </div>
        <div class="columns is-centered">
          <div id="c4-grid-0-4" class="column is-narrow"></div>
          <div id="c4-grid-1-4" class="column is-narrow"></div>
          <div id="c4-grid-2-4" class="column is-narrow"></div>
          <div id="c4-grid-3-4" class="column is-narrow"></div>
          <div id="c4-grid-4-4" class="column is-narrow"></div>
          <div id="c4-grid-5-4" class="column is-narrow"></div>
          <div id="c4-grid-6-4" class="column is-narrow"></div>
        </div>
        <div class="columns is-centered">
          <div id="c4-grid-0-3" class="column is-narrow"></div>
          <div id="c4-grid-1-3" class="column is-narrow"></div>
          <div id="c4-grid-2-3" class="column is-narrow"></div>
          <div id="c4-grid-3-3" class="column is-narrow"></div>
          <div id="c4-grid-4-3" class="column is-narrow"></div>
          <div id="c4-grid-5-3" class="column is-narrow"></div>
          <div id="c4-grid-6-3" class="column is-narrow"></div>
        </div>
        <div class="columns is-centered">
          <div id="c4-grid-0-2" class="column is-narrow"></div>
          <div id="c4-grid-1-2" class="column is-narrow"></div>
          <div id="c4-grid-2-2" class="column is-narrow"></div>
          <div id="c4-grid-3-2" class="column is-narrow"></div>
          <div id="c4-grid-4-2" class="column is-narrow"></div>
          <div id="c4-grid-5-2" class="column is-narrow"></div>
          <div id="c4-grid-6-2" class="column is-narrow"></div>
        </div>
        <div class="columns is-centered">
          <div id="c4-grid-0-1" class="column is-narrow"></div>
          <div id="c4-grid-1-1" class="column is-narrow"></div>
          <div id="c4-grid-2-1" class="column is-narrow"></div>
          <div id="c4-grid-3-1" class="column is-narrow"></div>
          <div id="c4-grid-4-1" class="column is-narrow"></div>
          <div id="c4-grid-5-1" class="column is-narrow"></div>
          <div id="c4-grid-6-1" class="column is-narrow"></div>
        </div>
        <div class="columns is-centered">
          <div id="c4-grid-0-0" class="column is-narrow"></div>
          <div id="c4-grid-1-0" class="column is-narrow"></div>
          <div id="c4-grid-2-0" class="column is-narrow"></div>
          <div id="c4-grid-3-0" class="column is-narrow"></div>
          <div id="c4-grid-4-0" class="column is-narrow"></div>
          <div id="c4-grid-5-0" class="column is-narrow"></div>
          <div id="c4-grid-6-0" class="column is-narrow"></div>
        </div>
      </div>
    </div>

    <button v-on:click="sendWebsocketMsg()">Click Me!</button>
  </div>
</template>

<script>
import channels from '@/channels'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  data () {
    return {
      showPlayerVersus: true,
      showDifficulty: false,
      showConnect4Grid: false
    }
  },
  mounted: function () {
    this.getCurrent()
  },
  computed: {
    ...mapGetters('game', [
      'getCurrentGame',
      'getJoinableGames'
    ]),

    showWaitingForPlayer: function () {
      return (!!this.getCurrentGame && !this.getCurrentGame.secondary_player_id)
    }
  },
  methods: {
    ...mapActions('game', [
      'createGame'
    ]),

    ...mapActions('user', [
      'getCurrent'
    ]),

    createGameVsPlayer: function () {
      this.createGame({ isOpponentAi: false })
    },

    generateGrid: function () {
      this.showConnect4Grid = true
    },

    sendWebsocketMsg: function () {
      channels.gamePlayChannel.send({ board_id: 2, column_index: 0 })
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
