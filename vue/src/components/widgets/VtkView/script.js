import vtkViewProxy from 'vtk.js/Sources/Proxy/Core/ViewProxy';

export default {
  name: 'VtkView',
  data() {
    return {
      view: vtkViewProxy.newInstance(),
    };
  },
  mounted() {
    this.container = this.$el.querySelector('.js-renderer');
    this.view.setContainer(this.container);
    this.onResize();
    this.view.getRenderer().setBackground(0.1, 0.1, 0.1);
  },
  beforeDestroy() {
    this.view.delete();
  },
  methods: {
    onResize() {
      if (this.view) {
        this.view.resize();
        this.view.renderLater();
      }
    },
    resetCamera() {
      if (this.view) {
        this.view.resetCamera();
      }
    },
  },
  computed: {
    dark() {
      return this.$vuetify.theme.dark;
    },
  },
  watch: {
    dark() {
      // if (this.dark) {
      //   this.view.setBackground([0.9, 0.1, 0.1, 0]);
      // } else {
      //   this.view.setBackground([0.9, 0.9, 0.9, 0]);
      // }
      this.$store.dispatch('CONE_SET_BACKGROUND', this.dark);
    },
  },
};
