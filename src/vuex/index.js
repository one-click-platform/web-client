import Vue from 'vue'
import Vuex from 'vuex'

import { vuexTypes } from '@/vuex/types'

Vue.use(Vuex)

export const rootModule = {
  actions: {},
  mutations: {
    // These mutations are being subscribed by plugins
    [vuexTypes.POP_STATE] () { },
    [vuexTypes.CLEAR_STATE] () { },
  },
  getters: {
    [vuexTypes.isLoggedIn]: state => {
      return Boolean(state.token)
    },
  },
  state: {
    token: '',
  },
}

let store
function buildStore () {
  store = new Vuex.Store({
    ...rootModule,
  })

  store.commit(vuexTypes.POP_STATE)

  return store
}
buildStore()

export { store, buildStore }
export { vuexTypes } from './types'
