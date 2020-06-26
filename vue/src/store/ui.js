export default {
  state: {
    navigation_drawer_open: false,
  },
  getters: {
    UI_NAVIGATION_DRAWER(state) {
      return state.navigation_drawer_open;
    },
  },
  mutations: {
    UI_NAVIGATION_DRAWER_SET(state, navigation_drawer_open) {
      state.navigation_drawer_open = navigation_drawer_open;
    },
  },
  actions: {
    UI_TOGGLE_NAVIGATION_DRAWER({ commit, getters }) {
      commit('UI_NAVIGATION_DRAWER_SET', !getters.UI_NAVIGATION_DRAWER);
    },
  },
};
