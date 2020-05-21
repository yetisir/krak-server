import ace from 'ace-builds';
import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-github';
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
  },
  data() {
    return {
      aceEditor: null,
      modePath: 'ace/mode/python',
    };
  },
  computed: {
    themePath() {
      return this.$vuetify.theme.dark
        ? 'ace/theme/monokai'
        : 'ace/theme/github';
    },
  },

  watch: {
    themePath: function(newTheme) {
      this.aceEditor.setTheme(newTheme);
    },
  },

  methods: {
    setCode(code) {
      this.aceEditor.setValue(code);
    },
    getCode() {
      return this.aceEditor.getValue();
    },
    runCode() {
      this.$store
        .dispatch('CONE_RUN_CODE', this.getCode())
        .then(this.$store.dispatch('CONE_UPDATE_OBJECTS'));
    },
  },
};
