import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    logged: false,
    user: {},
    default: false,
    subgroup: false
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
    },
    SETDEFAULT: (state, payload) => {
      state.default = payload
    },
    SETSUBGROUP: (state, payload) => {
      state.subgroup = payload
    }
  },
  actions: {

  },
  plugins: [createPersistedState()]
})
