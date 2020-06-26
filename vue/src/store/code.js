export default {
  state: {
    code: '',
    objects: {},
    codeStatus: 'exited',
  },
  getters: {
    CODE_STATUS(state) {
      return state.codeStatus;
    },
    CODE_TEXT(state) {
      return state.code;
    },
  },
  mutations: {
    CODE_STATUS_SET(state, value) {
      state.codeStatus = value;
    },
    CODE_TEXT_SET(state, value) {
      state.code = value;
    },
  },
  actions: {
    CODE_RUN({ rootState, commit }, code) {
      const client = rootState.network.client;
      if (!client) {
        return;
      }
      client
        .getRemote()
        .Code.runCode(code)
        .then(client.getRemote().Code.pushOutput());
      commit('CODE_STATUS_SET', 'submitted');
    },
    CODE_STOP({ rootState, commit }) {
      const client = rootState.network.client;
      if (!client) {
        return;
      }
      client.getRemote().Code.stopCode();
      commit('CODE_STATUS_SET', 'killrequested');
    },
    CODE_GET({ rootState, commit }) {
      const client = rootState.network.client;
      if (!client) {
        return;
      }
      client
        .getRemote()
        .Code.getCode()
        .then((value) => {
          commit('CODE_TEXT_SET', value);
        });
    },
  },
};
