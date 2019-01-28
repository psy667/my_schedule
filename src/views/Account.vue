<template lang="html">
  <div class="container">
    <!-- <h3>Аккаунт</h3> -->

    <div class="panel">
      <div class="panel-header text-center">
        <figure class="avatar avatar-lg"><img :src="user.photo" alt="Avatar"></figure>
        <div class="panel-title h5 mt-10">{{ user.name }}</div>
        <button class='btn logout' @click='logout()'>Выйти</button>
        <!-- <div class="panel-subtitle">THE HULK</div> -->
      </div>
      <div class="panel-body" >
      <h5 >Список моих расписаний ({{ items.length }})</h5>
        <div class="loading loading-lg" v-if='!loaded'></div>
        <div class="tile tile-centered"  v-for='item in items'>

          <div class="tile-content">
            <div class="tile-title text-bold"><router-link :to="{ name: 'schedule', query: {id: item.href} }" > {{ item.name }} </router-link> </div>
            <div class="tile-subtitle">{{ item.date }}</div>
          </div>
          <div class="tile-action">
            <router-link class="btn btn-link btn-action btn-lg tooltip tooltip-left"
                          data-tooltip="Редактировать" :to="{ name: 'edit', query: {id: item.href} }" >
              <i class="icon icon-edit"></i>
            </router-link>
            <button class='btn ' @click='del(item.href)'><i class="icon icon-delete"></i></button>
          </div>

        </div>
        <div class="modal modal-sm" :class="{active: modal}">
          <a class="modal-overlay" aria-label="Close" @click='modal = false'></a>
          <div class="modal-container py-2">
            <h6 class='mt-2' >Подтверждение</h6>
            <p class='mb-2' >Вы уверены что хотите удалить расписание?</p>
            <button class='btn btn-error' @click='confirmDel()'>Удалить</button>
            <button class='btn btn-secondary my-2' @click='modal = false'>Отмена</button>
          </div>
        </div>

      </div>

      <div class="panel-footer">
        <router-link :to='"add"' class="btn btn-primary btn-block" >Создать расписание</router-link>
      </div>
    </div>
  </div>
</template>

<script>

import firebase from 'firebase'

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
      items: [],
      loaded: false,
      ref: {},
      modal: false
    }
  },
  methods: {
    logout () {
      this.$store.commit('LOGOUT')
      this.$router.push('login')
    },
    del (href) {
      this.modal = true
      this.ref = firebase.database().ref('/schedules/' + href)
    },
    confirmDel () {
      this.ref.remove()
      this.modal = false
    }
  },
  computed: {
    user () {
      console.log(this.$store.state.logged)

      if (this.$store.state.logged) {
        return this.$store.state.user
      } else {
        return { name: 'Войти', photo: 'https://picturepan2.github.io/spectre/img/avatar-1.png' }
      }
    }
  },
  mounted () {
    if (!this.$store.state.logged) {
      this.$router.push('login')
    }

    let ref = firebase.database().ref('/schedules').orderByChild('creator').equalTo(this.$store.state.user.uid)

    let context = this
    let response

    ref.on('value', function (snapshot) {
      response = snapshot.val()
      context.items = []
      // , chair : response[item].chair
      Object.keys(response).forEach((item) => { context.items.push({ name: response[item].title, date: response[item].date, href: item }) })
      console.log(response)

      context.loaded = true
    }, function (error) {
      console.log('Error: ' + error.code)
    })
  }
}
</script>

<style lang="scss" scoped>
  .panel-header{
    display: flex;
    // justify-content: space-around;
  }
  .panel-title{
    margin-left: 20px;
    margin-right: auto;
  }
  button.logout{
    // align-self: flex-end;
    // margin-left: 100%;
  }
</style>
