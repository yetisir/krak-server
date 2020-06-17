export default {
  state: {
    resolution: 6,
    code: '',
    objects: {},
  },
  getters: {
    CONE_OBJECTS(state) {
      return state.objects;
    },
  },
  mutations: {
    CONE_OBJECTS_SET(state, value) {
      state.objects = value;
    },
  },
  actions: {
    CONE_UPDATE_OBJECTS({ rootState, commit }) {
      const client = rootState.network.client;
      if (client) {
        client
          .getRemote()
          .Cone.getObjects()
          .then((object) => {
            commit('CONE_OBJECTS_SET', object);
          })
          .catch(console.error);
      }
    },
    CONE_RUN_CODE({ rootState }, text) {
      const client = rootState.network.client;
      if (client) {
        client.getRemote().Cone.runCode(text);
      }
    },
    CONE_INITIALIZE({ rootState, dispatch }) {
      const client = rootState.network.client;
      if (client) {
        client
          .getRemote()
          .Cone.createVisualization()
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
      dispatch('CONE_UPDATE_OBJECTS');
    },
    CONE_RESET_CAMERA({ rootState, dispatch }) {
      const client = rootState.network.client;
      if (client) {
        client
          .getRemote()
          .Cone.resetCamera()
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
  },
};
