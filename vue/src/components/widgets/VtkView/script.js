import vtkViewProxy from 'vtk.js/Sources/Proxy/Core/ViewProxy';

// ----------------------------------------------------------------------------

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
    this.view.getRenderer().setBackground(0.5, 0.5, 0.5);
    this.onResize();
  },
  beforeDestroy() {
    this.view.delete();
  },
  // },  watch: {
  //   viewProxySize() {
  //     this.view.resize();
  //   },
  // },
  // updated() {
  //   this.view.resize();
  // },
  methods: {
    //   viewProxySize() {
    //     // const container = this.view.getContainer();
    //     const container = this.$el.querySelector('.js-renderer');

    //     // return container;
    //     return container.getBoundingClientRect().width;
    //     // } catch (err) {
    //     //   return err;
    //     // }
    //     // getBoundingClientRect
    //     // return this.view. ? this.view.getRenderWindow() : null;
    //   },
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
};
