/* eslint-disable arrow-body-style */
export default function createMethods(session) {
  return {
    createVisualization: () => session.call('vtk.initialize', []),
    resetCamera: () => session.call('vtk.camera.reset', []),
    runCode: (text) => session.call('code.run', [text]),
    // updateResolution: (resolution) =>
    //   session.call('vtk.cone.resolution.update', [resolution]),
  };
}
