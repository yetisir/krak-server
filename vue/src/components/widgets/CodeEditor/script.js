import ace from 'ace-builds';
import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/theme-monokai';
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
      themePath: 'ace/theme/monokai',
      modePath: 'ace/mode/python',
    };
  },
  methods: {
    setCode(code) {
      this.aceEditor.setValue(code);
    },
    getCode() {
      return this.aceEditor.getValue();
    },
    runCode() {
      this.$store.dispatch('CONE_RUN_CODE', this.getCode());
    },
  },
  // watch: {
  //   content(value) {
  //     if (this.beforeContent !== value) {
  //       this.editor.setValue(value, 1);
  //     }
  //   },
  // },
};
