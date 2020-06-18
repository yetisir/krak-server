export default function createMethods(session) {
  return {
    createVisualization: () => session.call('vtk.initialize', []),
    resetCamera: () => session.call('vtk.camera.reset', []),
    runCode: (text) => session.call('code.run', [text]),
    getObjects: () => session.call('data.objects', []),
    setBackground: (dark) => session.call('vtk.background.set', [dark]),
  };
}
