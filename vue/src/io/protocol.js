// CODE API
function setCodeStatus(status) {
  console.log('setting_code_status: ' + status);
}

// Old API
function handleMessage(data) {
  console.log('result ' + data);
}

export default function createMethods(session) {
  // Code API
  session.subscribe('setCodeStatus', setCodeStatus);

  // Old API
  session.subscribe('code.stdout', handleMessage);
  return {
    // Code API
    runCode: (code) => session.call('runCode', [code]),
    stopCode: () => session.call('stopCoce', []),
    getCodeStatus: () => session.call('getCodeStatus', []),

    // Old API
    createVisualization: () => session.call('vtk.initialize', []),
    resetCamera: () => session.call('vtk.camera.reset', []),
    getObjects: () => session.call('data.objects', []),
    setBackground: (dark) => session.call('vtk.background.set', [dark]),
  };
}
