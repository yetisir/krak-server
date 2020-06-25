import store from '@/store';

export default function createMethods(session) {
  // Code API
  session.subscribe('code.set_status', (status) => {
    console.log(store);
    store.commit('CODE_STATUS_SET', status);
  });

  return {
    // Code API
    runCode: (code) => session.call('code.run', [code]),
    stopCode: () => session.call('code.stop', []),
    getCodeStatus: () => session.call('code.get_status', []),
    pushOutput: () => session.call('code.push_output', []),

    // VTK API
    initializeVTK: () => session.call('vtk.initialize', []),
    resetCamera: () => session.call('vtk.reset_camera', []),
    setBackground: (dark) => session.call('vtk.set_background', [dark]),
  };
}
