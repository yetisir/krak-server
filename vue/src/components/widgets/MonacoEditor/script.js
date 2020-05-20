import MonacoEditor from 'vue-monaco';

export default {
  components: {
    MonacoEditor,
  },

  data() {
    return {
      code: 'const noop = () => {}',
    };
  },
};
