import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    auth: false,
    user: {
      _id: '',
      name: '',
      local: {}
    }
  },
  getters: {
    user: (state) => {
      return state.user;
    }
  },
  mutations: {
    getAuth(state, payload) {
      state.auth = payload;
    },
    getUser(state, payload) {
      state.user = payload
    }
  },
  actions: {},
  modules: {}
})