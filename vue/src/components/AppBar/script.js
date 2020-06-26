import logo from '@/assets/logo.png';
import NavigationDrawer from '@/components/NavigationDrawer';

export default {
  name: 'AppBar',
  components: {
    NavigationDrawer,
  },
  data() {
    return {
      logo,
    };
  },
  methods: {
    resetCamera() {
      this.$store.dispatch('VTK_RESET_CAMERA');
    },
    toggleNavigationDrawer() {
      this.$store.dispatch('UI_TOGGLE_NAVIGATION_DRAWER');
    },
  },
};
