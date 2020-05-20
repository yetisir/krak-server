import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
// import { TerminalStream } from './terminal-stream';

export default {
  name: 'Console',
  // props: {
  //   terminal: Object.assign(
  //     {
  //       buffer: String,
  //       title: String,
  //     },
  //     {
  //       cols: Number,
  //       rows: Number,
  //       convertEol: Boolean,
  //       termName: String,
  //       cursorBlink: Boolean,
  //       cursorStyle: String,
  //       bellSound: String,
  //       bellStyle: String,
  //       enableBold: Boolean,
  //       fontFamily: String,
  //       fontSize: Number,
  //       fontWeight: String,
  //       fontWeightBold: String,
  //       lineHeight: Number,
  //       letterSpacing: Number,
  //       scrollback: Number,
  //       screenKeys: Boolean,
  //       debug: Boolean,
  //       macoptionsIsMeta: Boolean,
  //       cancelEvents: Boolean,
  //       disableStdin: Boolean,
  //       useFlowControl: Boolean,
  //       allowTransparency: Boolean,
  //       tabStopWidth: Number,
  //       theme: Object,
  //     }
  //   ),
  // },

  data() {
    return {
      options: {},
    };
  },

  // watch: {
  //   cols(c) {
  //     this.$terminal.resize(c, this.rows);
  //   },
  //   rows(r) {
  //     this.$terminal.resize(this.cols, r);
  //   },
  //   options: {
  //     handler(o) {
  //       Object.keys(o).forEach((key) => {
  //         if (this[key] !== o[key]) this.$emit('update:' + key, o[key]);
  //       });
  //     },
  //     deep: true,
  //   },
  // },

  mounted() {
    // Object.keys(props).forEach((key) =>
    //   this.$set(this.options, key, this[key])
    // );
    let term = new Terminal({
      cols: 80,
      rows: 5,
    });
    let fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    fitAddon.fit();

    // term.linkifier.setHypertextLinkHandler((e, uri) => {
    //   this.$emit('link', uri);
    // });
    term.open(this.$el);
    // if (this.buffer) term.write(this.buffer.replace(/\n/g, '\r\n') + '\r\n');
    // term.on('blur', () => this.$emit('blur'));
    // term.on('focus', () => this.$emit('focus'));
    // term.on('resize', (size) => {
    //   if (size.cols !== this.cols) this.$emit('update:cols', size.cols);
    //   if (size.rows !== this.rows) this.$emit('update:rows', size.rows);
    // });
    // term.on('title', (title) => this.$emit('update:title', title));
    this.$terminal = term;
    // this.$stream = new TerminalStream(this);
    // Object.keys(props).forEach((key) =>
    //   this.$watch(key, (val) => (this.options[key] = val))
    // );
  },
  // beforeDestroy() {
  //   this.$terminal.selectAll();
  //   this.$emit('update:buffer', this.$terminal.getSelection().trim());
  //   this.$terminal.destroy();
  // },
  methods: {
    fit() {
      let parent = this.$el.parentNode;
      let term = this.$terminal;
      term.element.style.display = 'none';
      setTimeout(() => {
        this.$el.style.width =
          parent.offsetWidth - this.$el.offsetLeft + parent.offsetLeft + 'px';
        this.$el.style.height =
          parent.offsetHeight - this.$el.offsetTop + parent.offsetTop + 'px';
        term.fit();
        term.element.style.display = '';
        term.refresh(0, term.rows - 1);
      }, 0);
    },
    focus() {
      this.$terminal.focus();
    },
    blur() {
      this.$terminal.blur();
    },
  },
};
