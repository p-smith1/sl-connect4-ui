import ActionCable from 'actioncable'
import store from '@/store'
import callbacks from './callbacks'

let consumer = null
let availableGamesSubscription = null
let gamePlaySubscription = null

const channels = {
  getConsumer: () => {
    const accessToken = store.state.user.accessToken

    if (!consumer && accessToken) {
      console.log(`${process.env.BASE_CABLE_API}?access_token=${store.state.user.accessToken}`)
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

    if (!gamePlaySubscription && consumer) {
      gamePlaySubscription = consumer.subscriptions
        .create({ channel: 'GamePlayChannel', board_id: boardId }, {
          received: (data) => {
            console.log(data)
          },

          rejected: () => {
            console.log('rejected')
          }
        })
    }

    return gamePlaySubscription
  }
}

export default channels
