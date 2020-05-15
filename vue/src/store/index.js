// import Vue from 'vue';
import Vuex from 'vuex';

import busy from '@/store/busy';
import cone from '@/store/cone';
import network from '@/store/network';
import view from '@/store/view';

/* eslint-enable no-param-reassign */

function createStore() {
  return new Vuex.Store({
    state: {
      dark: true,
    },
    modules: {
      busy,
      cone,
      network,
      view,
    },
    getters: {
      APP_DARK_THEME(state) {
        return state.dark;
      },
    },
    mutations: {
      APP_DARK_THEME_SET(state, isDark) {
        state.dark = isDark;
      },
    },
  });
}

export default createStore;
