// import Vue from 'vue';
import Vuex from 'vuex';

import busy from '@app/store/busy';
import cone from '@app/store/cone';
import network from '@app/store/network';
import view from '@app/store/view';

/* eslint-enable no-param-reassign */

function createStore() {
  return new Vuex.Store({
    state: {
      dark: false,
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
