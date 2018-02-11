<template>
  <div id="homePageComponent">
    <div class="title-container">
      <img src="../assets/patrick-emoji-1.png" alt="Patrick Smith" />
      <img src="../assets/connect4-logo.png" alt="Connect 4" />
    </div>

    <div v-if="showLoginErrorMsg" id="loginErrorMsg" class="notification is-danger">
      <button class="delete"></button>
      Login Error Occurred
    </div>

    <button id="loginBtn" v-on:click="signIn" class="button is-danger">
      <span class="icon">
        <i class="fab fa-google"></i>
      </span>
      <span class="has-text-weight-bold">Sign in with Google</span>
    </button>
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
.title-container {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
