import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

import '@/../node_modules/xterm/css/xterm.css';
// import { VueTerminal } from 'vue-terminal-ui';
// import { TerminalStream } from './terminal-stream';

export default {
  name: 'Console',
  // components: {
  //   Terminal,
  //   XTerm,
  // },
  props: {
    height: {
      type: String,
      default: '100%',
    },
    intro: {
      type: String,
      default: 'KraK Console',
    },
    allowArbitrary: {
      type: Boolean,
      default: false,
    },
    fullScreen: {
      type: Boolean,
      default: false,
    },
    consoleSign: {
      type: String,
      default: '$',
    },
  },
  data() {
    return {
      terminal: null,
      waiting: false,
    };
  },
  mounted() {
    this.$store.dispatch('SSH_CONNECT');

    var decoder = window.TextDecoder
      ? new window.TextDecoder('utf-8')
      : 'utf-8';

    this.terminal = new Terminal({
      cursorBlink: true,
      theme: {
        background: 'black',
        cursor: 'blue',
      },
    });

    this.terminal.open(this.$refs.terminal, true);
    this.terminal.write('krak-terminal $: ');
    // this.terminal.prompt();
    this.terminal.onKey((e) => {
      const ev = e.domEvent;
      const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;

      if (ev.keyCode === 13) {
        this.terminal.writeln('');
        this.terminal.write('krak-terminal $: ');
      } else if (ev.keyCode === 8) {
        // Do not delete the prompt
        if (this.terminal._core.buffer.x > 2) {
          this.terminal.write('\b \b');
        }
      } else if (printable) {
        this.terminal.write(e.key);
      }
    });
    // });
    // this.sock = new window.WebSocket('ws://0.0.0.0:8888/ws');
    // this.sock.onmessage = function(event) {
    //   console.log(event);
    // };
    // this.sock.onopen = function(event) {
    //   console.log(event);
    //   console.log('Success ssh connect ...');
    // };
    // console.log('webbbbb');

    //   data = new FormData()

    //   jQuery.ajax({
    //     url: 'http://0.0.0.0:8888',
    //     type: 'post',
    //     data: data,
    //     complete: ajax_complete_callback,
    //     cache: false,
    //     contentType: false,
    //     processData: false
    // });
  },
  methods: {
    onCliCommand(data, resolve, reject) {
      // typed command is available in data.text
      // don't forget to resolve or reject the Promise
      setTimeout(() => {
        resolve('');
      }, 300);
    },
    toggleWaiting() {
      this.waiting = !this.waiting;
    },
  },
};
