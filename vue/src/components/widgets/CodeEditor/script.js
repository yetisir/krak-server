import { mapGetters } from 'vuex';
import ace from 'ace-builds';
import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/theme-clouds_midnight';
import 'ace-builds/src-noconflict/theme-clouds';
import 'ace-builds/src-noconflict/mode-python';

export default {
  mounted() {
    this.aceEditor = ace.edit(this.$refs.ace, {
      maxLines: 20,
      minLines: 20,
      fontSize: 14,
      theme: this.themePath,
      mode: this.modePath,
      tabSize: 4,
    });
    this.aceEditor.setAutoScrollEditorIntoView(true);
    // this.pollStatus();
    this.buttonUpdate('exited');
  },
  data() {
    return {
      aceEditor: null,
      modePath: 'ace/mode/python',
      buttonColor: '',
      buttonIcon: '',
      buttonLoading: false,
    };
  },
  computed: {
    ...mapGetters(['CODE_STATUS']),
    themePath() {
      return this.$vuetify.theme.dark
        ? 'ace/theme/clouds_midnight'
        : 'ace/theme/clouds';
    },
    codeStatus() {
      return this.$store.getters.CODE_STATUS;
    },
  },

  watch: {
    themePath(newTheme) {
      this.aceEditor.setTheme(newTheme);
    },
    codeStatus(newStatus) {
      this.buttonUpdate(newStatus);
    },
  },

  methods: {
    setCode(code) {
      this.aceEditor.setValue(code);
    },
    getCode() {
      return this.aceEditor.getValue();
    },
    buttonRun() {
      const method = this.codeStatus ? 'CODE_RUN' : 'CODE_STOP';
      console.log(method);
      this.$store
        .dispatch(method)
        // .then(this.$store.dispatch('CONE_UPDATE_OBJECTS'))
        .then(this.$store.dispatch('VIEW_UPDATE_RESIZE'));
    },
    buttonUpdate(code_status) {
      if (code_status == 'running') {
        this.buttonLoading = false;
        this.buttonColor = 'red';
        this.buttonIcon = 'mdi-stop';
      } else if (code_status === 'submitted') {
        this.buttonLoading = true;
      } else {
        this.buttonLoading = false;
        this.buttonColor = 'green';
        this.buttonIcon = 'mdi-play';
      }
    },
    // pollStatus() {
    //   setInterval(() => {
    //     this.$store.dispatch('CODE_UPDATE');
    //     console.log('loading ' + this.codeRunning + ' ' + this.buttonLoading);
    //   }, 100);
    // },
  },
};
