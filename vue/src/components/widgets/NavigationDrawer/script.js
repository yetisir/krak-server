export default {
  name: 'NavigationDrawer',
  data: () => {
    return {
      navigation: {
        width: 200,
        borderSize: 3,
      },
    };
  },
  methods: {
    setBorderWidth() {
      let border = this.$refs.drawer.$el.querySelector(
        '.v-navigation-drawer__border'
      );
      border.style.width = this.navigation.borderSize + 'px';
      border.style.cursor = 'ew-resize';
    },
    setEvents() {
      const drawer = this.$refs.drawer.$el;
      const drawerBorder = drawer.querySelector('.v-navigation-drawer__border');

      function resize(e) {
        document.body.style.cursor = 'ew-resize';
        drawer.style.width = document.body.scrollWidth - e.clientX + 'px';
      }

      drawerBorder.addEventListener(
        'mousedown',
        (e) => {
          if (e.offsetX < this.navigation.borderSize) {
            drawer.style.transition = 'initial';
            document.addEventListener('mousemove', resize, false);
          }
        },
        false
      );

      drawerBorder.addEventListener(
        'mouseup',
        () => {
          drawer.style.transition = '';
          this.navigation.width = drawer.style.width;
          document.body.style.cursor = '';
          document.removeEventListener('mousemove', resize, false);
          this.updateView();
        },
        false
      );
    },
    updateView() {
      this.$store.dispatch('VIEW_UPDATE_CAMERA');
    },
  },
  mounted() {
    this.setBorderWidth();
    this.setEvents();
  },
};
