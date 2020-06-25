import logo from '@/assets/logo.png';

export default {
  name: 'AppBar',
  data() {
    return {
      logo,
    };
  },
  methods: {
    resetCamera() {
      this.$store.dispatch('VTK_RESET_CAMERA');
    },
  },
};
