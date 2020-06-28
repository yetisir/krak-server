export default {
  state: {
    navigation_drawer_open: false,
    show_object_graph: false,
  },
  getters: {
    UI_NAVIGATION_DRAWER(state) {
      return state.navigation_drawer_open;
    },
    UI_OBJECT_GRAPH(state) {
      return state.show_object_graph;
    },
  },
  mutations: {
    UI_NAVIGATION_DRAWER_SET(state, navigation_drawer_open) {
      state.navigation_drawer_open = navigation_drawer_open;
    },
    UI_OBJECT_GRAPH_SET(state, show_object_graph) {
      state.show_object_graph = show_object_graph;
    },
  },
  actions: {
    UI_TOGGLE_NAVIGATION_DRAWER({ commit, getters }) {
      commit('UI_NAVIGATION_DRAWER_SET', !getters.UI_NAVIGATION_DRAWER);
    },
    UI_TOGGLE_OBJECT_GRAPH({ commit, getters }) {
      commit('UI_OBJECT_GRAPH_SET', !getters.UI_OBJECT_GRAPH);
    },
  },
};
