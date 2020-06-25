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
    this.buttonUpdate('exited');
  },
  data() {
    return {
      aceEditor: null,
      modePath: 'ace/mode/python',
      buttonColor: '',
      buttonIcon: '',
      buttonLoading: false,
      snackbar: false,
      snackbarText: '',
      snackbarTimeout: null,
      snackbarColor: 'gray',
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
    snackbarText() {
      this.snackbar = true;
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
      if (this.codeStatus == 'running') {
        this.$store
          .dispatch('CODE_STOP')
          .then(this.$store.dispatch('VIEW_UPDATE_RESIZE'));
      } else {
        this.$store
          .dispatch('CODE_RUN', this.getCode())
          .then(this.$store.dispatch('VIEW_UPDATE_RESIZE'));
      }
    },
    buttonUpdate(code_status) {
      if (code_status == 'running') {
        this.buttonLoading = false;
        this.buttonColor = 'red';
        this.buttonIcon = 'mdi-stop';
        this.snackbarText = 'Running model ...';
      } else if (code_status === 'submitted') {
        this.buttonLoading = true;
        this.snackbarText = 'Submitting model ...';
      } else if (code_status === 'killrequested') {
        this.buttonLoading = true;
        this.snackbarText = 'Killing model ...';
      } else {
        this.buttonLoading = false;
        this.buttonColor = 'green';
        this.buttonIcon = 'mdi-play';
        this.snackbarText = 'Server ready to accept model ...';
      }
    },
  },
};
