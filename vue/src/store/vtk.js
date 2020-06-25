export default {
  actions: {
    // VTK_INITIALIZE({ rootState, dispatch }) {
    //   const client = rootState.network.client;
    //   if (client) {
    //     client
    //       .getRemote()
    //       .Code.initializeVTK()
    //       .then(
    //         ({ focalPoint, viewUp, position, centerOfRotation, bounds }) => {
    //           dispatch('VIEW_UPDATE_CAMERA', {
    //             focalPoint,
    //             viewUp,
    //             position,
    //             centerOfRotation,
    //             bounds,
    //           });
    //         }
    //       )
    //       .catch(console.error);
    //   }
    // },
    VTK_RESET_CAMERA({ rootState, dispatch }) {
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
    VTK_SET_BACKGROUND({ rootState, dispatch }, dark) {
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
