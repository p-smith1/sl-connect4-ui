<template>
  <div id="homePageComponent">
    <div v-if="showLoginErrorMsg" id="loginErrorMsg" class="notification is-danger">
      <button class="delete"></button>
      Login Error Occurred
    </div>

    <button id="loginBtn" v-on:click="signIn" class="button is-primary">Login</button>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('user')

export default {
  name: 'Home',
  data () {
    return {
      showLoginErrorMsg: false
    }
  },
  methods: {
    ...mapActions([
      'login'
    ]),
    signIn: function () {
      this.login()
        .then(() => {
          this.$router.push({ name: 'Dashboard' })
        })
        .catch((e) => {
          this.showLoginErrorMsg = true
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
