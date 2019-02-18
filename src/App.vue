<template>
  <div id="app">

    <router-view/>
    <div id="menu" class="bg-primary">
      <!-- <button @click='navShow = !navShow' class="btn btn-lg btn-action btn-primary" ><i class="icon" :class='button'></i></button> -->
      <!-- <div class="name" @click='navShow = false'>

        <router-link class='text-light' :to="href">{{ user.name }}</router-link>
        <figure class="avatar avatar-sm">
          <img :src="user.photo">
        </figure>
      </div> -->
      <ul click='navShow = !navShow' class='nav'>
        <li class='nav-item'><router-link to="/search"><i class="icon icon-search"></i></router-link></li>
        <li class='nav-item'><router-link to="/add"><i class="icon icon-plus"></i></router-link></li>
        <li class='nav-item'><router-link to="/" ><i class="icon icon-menu"></i></router-link></li>
        <li class='nav-item'><router-link to="/author"><i class="icon icon-link"></i></router-link></li>
        <li class='nav-item'><router-link to="/account"><i class="icon icon-people"></i></router-link></li>
      </ul>
    </div>
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

.container{
    min-height: 100vh;
    padding: 30px 1rem !important;
    // padding-top: 50px;
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
  // min-height: 100vh;
  max-height: 100vh;
}
#menu {
  width: 100%;
  max-width: 500px;
  position: fixed;
  height: 50px;
  bottom: 0px;
  z-index: 30;
  padding: 0;
  border-top: 1px solid #cbd0d9;
  // top: 90vh;
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
    height: 50px;
    margin: 0;
    background-color: #fff;
    padding-top: 1px;
    position: absolute;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    // flex-wrap: nowrap;
    li{
      // width: 50px;
      width: 100%;
      display: flex;
      margin: 0px;
    a{
      display: block;
      width: 100%;

      padding-top: 10px;
      &.router-link-exact-active{
        font-weight: bold;
      }
      i{
        display: block;
        margin: auto;
        transform: scale(1.2);
        margin-top: 6px;
      }
      .icon-plus, .icon-menu{
        &::before, &::after{
          border-radius: 3px;
        }
      }
      .icon-search {
        &::after{
          border-radius: 3px;
        }
      }
    }
    }
  }
}
</style>
