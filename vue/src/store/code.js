export default {
  state: {
    // resolution: 6,
    code: '',
    objects: {},
    codeStatus: 'exited',
  },
  getters: {
    // CONE_OBJECTS(state) {
    //   return state.objects;
    // },
    CODE_STATUS(state) {
      return state.codeStatus;
    },
  },
  mutations: {
    // CONE_OBJECTS_SET(state, value) {
    //   state.objects = value;
    // },
    CODE_STATUS_SET(state, value) {
      state.codeStatus = value;
    },
  },
  actions: {
    // CONE_UPDATE_OBJECTS({ rootState, commit }) {
    //   const client = rootState.network.client;
    //   if (client) {
    //     client
    //       .getRemote()
    //       .Cone.getObjects()
    //       .then((object) => {
    //         commit('CONE_OBJECTS_SET', object);
    //       })
    //       .catch(console.error);
    //   }
    // },
    // CODE_UPDATE({ rootState, commit, getters }) {
    //   const client = rootState.network.client;
    //   if (~client) {
    //     return;
    //   }

    //   client
    //     .getRemote()
    //     .Code.codeStatus()
    //     .then((code_status) => {
    //       if (
    //         (getters.CODE_STATUS === 'submitted') &
    //         (code_status != 'running')
    //       ) {
    //         commit('CODE_STATUS_SET', 'submitted');
    //       } else {
    //         commit('CODE_STATUS_SET', code_status);
    //       }
    //     })
    //     .catch(console.error);

    // if (client) {
    //   client
    //     .getRemote()
    //     .Code.codeStatus()
    //     .then((code_status) => {
    //       if (
    //         (getters.CODE_STATUS === 'submitted') &
    //         (code_status != 'running')
    //       ) {
    //         commit('CODE_STATUS_SET', 'submitted');
    //       } else {
    //         commit('CODE_STATUS_SET', code_status);
    //       }
    //     })
    //     .catch(console.error);
    // }
    // },
    CODE_RUN({ rootState }, code) {
      const client = rootState.network.client;
      if (~client) {
        return;
      }
      client.getRemote().Code.runCode(code);

      // if (client) {
      //   // client.getRemote().Cone.runCode(text);
      //   if (getters.CODE_STATUS === 'running') {
      //     // commit('CODE_RUNNING_SET', false);
      //   } else if (getters.CODE_STATUS != 'submitted') {
      //     commit('CODE_STATUS_SET', 'submitted');
      //     client.getRemote().Cone.runCode(text);
      //   }
      // }
    },
    CODE_STOP({ rootState }) {
      const client = rootState.network.client;
      if (~client) {
        return;
      }
      client.getRemote().Code.stopCode();
    },
    CONE_INITIALIZE({ rootState, dispatch }) {
      const client = rootState.network.client;
      if (client) {
        client
          .getRemote()
          .Code.createVisualization()
          .then(
            ({ focalPoint, viewUp, position, centerOfRotation, bounds }) => {
              dispatch('VIEW_UPDATE_CAMERA', {
                focalPoint,
                viewUp,
                position,
                centerOfRotation,
                bounds,
              });
            }
          )
          // .then(dispatch('CONE_UPDATE_OBJECTS'))
          .catch(console.error);
      }
    },
    CONE_RESET_CAMERA({ rootState, dispatch }) {
      const client = rootState.network.client;
      if (client) {
        client
          .getRemote()
          .Code.resetCamera()
          .then(
            ({ focalPoint, viewUp, position, centerOfRotation, bounds }) => {
              dispatch('VIEW_UPDATE_CAMERA', {
                focalPoint,
                viewUp,
                position,
                centerOfRotation,
                bounds,
              });
            }
          )
          .catch(console.error);
      }
    },
    CONE_SET_BACKGROUND({ rootState, dispatch }, dark) {
      const client = rootState.network.client;
      if (client) {
        client
          .getRemote()
          .Code.setBackground(dark)
          .then(dispatch('VIEW_UPDATE_RESIZE'));
      }
    },
  },
};
