<template lang="html">
  <div class="container">
    <h3>Вход</h3>
      <button class='btn btn-lg' @click='login'>
        <svg aria-hidden="true" class="" width="20" height="20" viewBox="0 0 20 20">
          <path d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z" fill="#4285F4"></path>
          <path d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z" fill="#34A853"></path>
          <path d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z" fill="#FBBC05"></path>
          <path d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z" fill="#EA4335"></path>
        </svg>
      <span>Войти через Google</span></button>
      <div class="img"></div>
  </div>
</template>

<script>

import firebase from 'firebase'
import Vue from 'vue'

let config = {
  apiKey: 'AIzaSyA6hIR7mCJwccJ6ndZZluTxo4WQi5olfkw',
  authDomain: 'schedule-480c2.firebaseapp.com',
  databaseURL: 'https://schedule-480c2.firebaseio.com',
  projectId: 'schedule-480c2',
  storageBucket: 'schedule-480c2.appspot.com',
  messagingSenderId: '581207968061'
}

if (!firebase.apps.length) {
  firebase.initializeApp(config)
}
export default {
  data () {
    return {

    }
  },
  methods: {
    login () {
      let context = this
      let provider = new firebase.auth.GoogleAuthProvider()
      // var provider = new firebase.auth.GithubAuthProvider();
      firebase.auth().signInWithPopup(provider).then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken
        // The signed-in user info.
        var user = result.user

        context.$store.commit('LOGIN', { uid: user.uid, name: user.displayName, photo: user.photoURL })

        console.log(user)
        context.$router.push('account')
      }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code
        var errorMessage = error.message
        // The email of the user's account used.
        var email = error.email
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential
        console.log(error)
        // ...
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  button{
    position: relative;
    display: block;
    margin: auto;
    svg{
      position: absolute;
      top: 10px;
      left: 10px;
    }
    span{
      margin-left: 25px;
    }
  }
  .img{
    width: 50vw;
    max-width: 50%;
    margin: 50px auto;
    height: 90vw;
    max-height: 500px;
    background-image: url(../assets/login_pic.svg);
    background-repeat: no-repeat;
    background-size: contain;
  }
</style>
