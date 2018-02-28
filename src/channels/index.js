import ActionCable from 'actioncable'
import store from '@/store'
import callbacks from './callbacks'

let consumer = null
let availableGamesSubscription = null
let gamePlaySubscriptions = {}

const channels = {
  getConsumer: () => {
    const accessToken = store.state.user.accessToken

    if (!consumer && accessToken) {
      consumer = ActionCable
        .createConsumer(`${process.env.BASE_CABLE_API}?access_token=${store.state.user.accessToken}`)
    }

    return consumer
  },

  getAvailableGamesChannel: () => {
    const consumer = channels.getConsumer()

    if (!availableGamesSubscription && consumer) {
      availableGamesSubscription = consumer.subscriptions
        .create({ channel: 'AvailableGamesChannel' }, callbacks.availableGamesChannel)
    }

    return availableGamesSubscription
  },

  getPlayGameChannel: (boardId) => {
    const consumer = channels.getConsumer()

    if (!gamePlaySubscriptions[boardId] && consumer) {
      const subscription = consumer.subscriptions
        .create({ channel: 'GamePlayChannel', board_id: boardId }, callbacks.playGameChannel)

      gamePlaySubscriptions[boardId] = subscription
    }

    return gamePlaySubscriptions[boardId]
  }
}

export default channels
