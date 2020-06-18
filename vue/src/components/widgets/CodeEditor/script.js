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
        ? 'ace/theme/clouds_midnight'
        : 'ace/theme/clouds';
    },
  },

  // //"chrome": "Chrome DevTools",
  // "clouds": "Clouds",
  // "clouds_midnight": "Clouds Midnight",
  // "cobalt": "Cobalt",
  // //"crimson_editor": "Crimson Editor",
  // "dawn": "Dawn",
  // //"dreamweaver": "Dreamweaver",
  // //"eclipse": "Eclipse",
  // //"github": "GitHub",
  // "idle_fingers": "idleFingers",
  // "kr_theme": "krTheme",
  // "merbivore": "Merbivore",
  // "merbivore_soft": "Merbivore Soft",
  // "mono_industrial": "monoindustrial",
  // "monokai": "Monokai",
  // "nord_dark": "Nord Dark",
  // "pastel_on_dark": "Pastels on Dark",
  // "solarized_dark": "Solarized-dark",
  // "solarized_light": "Solarized-light",
  // "katzenmilch": "Katzenmilch",
  // "kuroir": "Kuroir Theme",
  // //"textmate": "Textmate (Mac Classic)",
  // "tomorrow": "Tomorrow",
  // "tomorrow_night": "Tomorrow-Night",
  // "tomorrow_night_blue": "Tomorrow-Night-Blue",
  // "tomorrow_night_bright": "Tomorrow-Night-Bright",
  // "tomorrow_night_eighties": "Tomorrow-Night-Eighties",
  // "twilight": "Twilight",
  // "vibrant_ink": "Vibrant Ink",
  // "xcode": "Xcode_default"

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
        .then(this.$store.dispatch('CONE_UPDATE_OBJECTS'))
        .then(this.$store.dispatch('VIEW_UPDATE_RESIZE'));
    },
  },
};
