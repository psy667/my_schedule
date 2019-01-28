<template>
  <div id="app">

    <div id="menu" class="bg-primary">
      <button @click='navShow = !navShow' class="btn btn-lg btn-action btn-primary" ><i class="icon" :class='button'></i></button>
      <div class="name" @click='navShow = false'>

        <router-link class='text-light' :to="href">{{ user.name }}</router-link>
        <figure class="avatar avatar-sm">
          <img :src="user.photo">
        </figure>
      </div>
      <ul v-show='navShow' @click='navShow = !navShow' class='nav'>
        <li class='nav-item'><router-link to="/" >Главная</router-link></li>
        <li class='nav-item'><router-link to="/search">Поиск</router-link></li>
        <li class='nav-item'><router-link to="/add">Добавить расписание</router-link></li>
        <li class='nav-item'><router-link to="/account">Мои расписания</router-link></li>
        <li class='nav-item bottom'><router-link to="/author">Авторы</router-link></li>
      </ul>
    </div>
    <router-view/>
  </div>
</template>
<script>
// import { mapState } from 'vuex';
export default {
  data () {
    return {
      navShow: false
    }
  },
  methods: {

  },
  computed: {
    user () {
      console.log(this.$store.state.logged)

      if (this.$store.state.logged) {
        return this.$store.state.user
      } else {
        return { name: 'Войти', photo: 'https://picturepan2.github.io/spectre/img/avatar-1.png' }
      }
    },
    href () {
      if (this.$store.state.logged) {
        return '/account'
      } else {
        return '/login'
      }
    },
    button () {
      return {
        'icon-menu': !this.navShow,
        'icon-cross': this.navShow
      }
    }
  }
}
</script>
<style lang="scss">
body{
  background: #333 !important;
}
.container{
    padding: 0 1rem !important;
}
#app {
  // font-family: 'Avenir', Helvetica, Arial, sans-serif;
  // -webkit-font-smoothing: antialiased;
  // -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  // color: #2c3e50;
  max-width: 500px;
  margin: auto;
  background: #fff;
  min-height: 100vh;
}
#menu {
  width: 100%;
  position: relative;
  margin-bottom: 30px;
  button{
    margin: 6px;
  }
  .name{
    float: right;
    height: 100%;
    line-height: 52px;
    margin-right: 20px;
  }
  .avatar{
    margin-left: 10px;
  }
  ul.nav{
    width: 100%;
    height: calc(100vh - 52px);
    margin: 0;
    background-color: #fff;
    padding-top: 10px;
    position: absolute;
    z-index: 10;
    li{
      &.bottom{
        width: 100%;
        position: absolute;
        bottom: 50px;
        a{
          text-align: center;
          margin-left: 0;
        }
      }
    a{
      display: block;
      width: 100%;
      margin-left: 20px;
      &.router-link-exact-active{
        font-weight: bold;
      }
    }
    }
  }
}
</style>
