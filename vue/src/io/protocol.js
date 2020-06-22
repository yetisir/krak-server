import store from '@/store/index';

// CODE API
function setCodeStatus(status) {
  console.log(store);
  store.commit('CODE_STATUS_SET', status);
}

// Old API
function handleMessage(data) {
  console.log('result ' + data);
}

export default function createMethods(session) {
  // Code API
  session.subscribe('code.set_status', setCodeStatus);

  // Old API
  session.subscribe('code.stdout', handleMessage);
  return {
    // Code API
    runCode: (code) => session.call('code.run', [code]),
    stopCode: () => session.call('code.stop', []),
    getCodeStatus: () => session.call('code.get_status', []),

    // Old API
    createVisualization: () => session.call('vtk.initialize', []),
    resetCamera: () => session.call('vtk.camera.reset', []),
    getObjects: () => session.call('data.objects', []),
    setBackground: (dark) => session.call('vtk.background.set', [dark]),
  };
}
