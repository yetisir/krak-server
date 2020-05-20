import { Terminal } from 'xterm';

export default {
  name: 'Console',
  props: {
    terminal: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      term: null,
      terminalSocket: null,
    };
  },
  methods: {
    runRealTerminal() {
      console.log('webSocket is finished');
    },
    errorRealTerminal() {
      console.log('error');
    },
    closeRealTerminal() {
      console.log('close');
    },
  },
  mounted() {
    console.log('pid : ' + this.terminal.pid + ' is on ready');
    let terminalContainer = document.getElementById('terminal');
    this.term = new Terminal({
      // cursorBlink: true,
      // cols: 80,
      // rows: 20,
    });
    this.term.open(terminalContainer);
    this.term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ');

    // open websocket
    // this.terminalSocket = new WebSocket(
    //   'ws://127.0.0.1:3000/terminals/' + this.terminal.pid
    // );
    // this.terminalSocket.onopen = this.runRealTerminal;
    // this.terminalSocket.onclose = this.closeRealTerminal;
    // this.terminalSocket.onerror = this.errorRealTerminal;
    // this.term.attach(this.terminalSocket);
    // this.term._initialized = true;
    // console.log('mounted is going on');
  },
  // beforeDestroy() {
  //   this.terminalSocket.close();
  //   this.term.destroy();
  // },
};
