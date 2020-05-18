export default {
  name: 'NavigationDrawer',
  data: () => {
    return {
      navigation: {
        width: 200,
        borderSize: 3,
      },
      right: true,
      permanent: true,
      expandOnHover: true,
      dark: true,
    };
  },
  methods: {
    triggerResize() {
      window.dispatchEvent(new Event('resize'));
    },
    setBorderWidth() {
      let border = this.$refs.drawer.$el.querySelector(
        '.v-navigation-drawer__border'
      );
      border.style.width = this.navigation.borderSize + 'px';
      border.style.cursor = 'ew-resize';
    },
    resize(event) {
      document.body.style.cursor = 'ew-resize';
      this.$refs.drawer.$el.style.width =
        document.body.scrollWidth - event.clientX + 'px';
      this.navigation.width = this.$refs.drawer.$el.style.width;
      // this.triggerResize();
    },
    setEvents() {
      const drawerBorder = this.$refs.drawer.$el.querySelector(
        '.v-navigation-drawer__border'
      );

      drawerBorder.addEventListener(
        'mousedown',
        (e) => {
          if (e.offsetX < this.navigation.borderSize) {
            // this.$refs.drawer.$el.style.transition = '';
            document.addEventListener('mousemove', this.resize, false);
          }
        },
        false
      );

      document.addEventListener(
        'mouseup',
        () => {
          this.triggerResize();
          this.$refs.drawer.$el.style.transition = '';
          this.navigation.width = this.$refs.drawer.$el.style.width;
          document.body.style.cursor = '';
          document.removeEventListener('mousemove', this.resize, false);
        },
        false
      );
    },
  },

  mounted() {
    this.setBorderWidth();
    this.setEvents();
  },
};
