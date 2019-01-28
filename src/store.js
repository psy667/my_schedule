import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    logged: false,
    user: {}
  },
  getters: {},
  mutations: {
    LOGIN: (state, payload) => {
      state.logged = true
      state.user = payload
    },
    LOGOUT: (state) => {
      state.logged = false
      state.user = {}
    }
  },
  actions: {
    getData (context) {
      let url = 'http://demo4779301.mockable.io/db2'

      fetch(url).then(response => response.json()).then(data => {
        context.commit('getData', data)
        context.commit('filterOut')
      })
    }
  },
  plugins: [createPersistedState()]
})
