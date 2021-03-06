import VtkView from '@/components/widgets/VtkView';
import RemoteRenderingView from '@/components/widgets/RemoteRenderingView';
import ProgressBar from '@/components/widgets/ProgressBar';
import NavigationDrawer from '@/components/widgets/NavigationDrawer';
import CodeEditor from '@/components/widgets/CodeEditor';
import AppBar from '@/components/widgets/AppBar';

// ----------------------------------------------------------------------------
// Component API
// ----------------------------------------------------------------------------

export default {
  name: 'App',
  components: {
    VtkView,
    RemoteRenderingView,
    ProgressBar,
    NavigationDrawer,
    CodeEditor,
    AppBar,
  },
  computed: {
    client() {
      return this.$store.getters.NETWORK_CLIENT;
    },
    // darkMode: {
    //   get() {
    //     return this.$store.getters.APP_DARK_THEME;
    //   },
    //   set(value) {
    //     this.$vuetify.theme.dark;
    //   },
    // },
    busyPercent() {
      return this.$store.getters.BUSY_PROGRESS;
    },
    // resolution: {
    //   get() {
    //     return this.$store.getters.CONE_RESOLUTION;
    //   },
    //   set(value) {
    //     this.$store.dispatch(Actions.CONE_UPDATE_RESOLUTION, Number(value));
    //   },
    // },
  },
  watch: {
    client() {
      // Setup view for remote rendering
      this.$store.dispatch('VIEW_REMOTE_RENDERING_SETUP');

      // This only happen once when the connection is ready
      this.$store.dispatch('CONE_INITIALIZE');
    },
  },

  mounted() {
    // Register view to the store
    this.$store.commit('VIEW_PROXY_SET', this.$refs.vtkViewComponent.view);

    // Initiate network connection
    const config = { application: 'cone' };
    config.sessionURL = 'ws://localhost:1234/ws';
    this.$store.commit('NETWORK_CONFIG_SET', config);
    this.$store.dispatch('NETWORK_CONNECT');

    setInterval(() => this.$store.dispatch('BUSY_UPDATE_PROGRESS', 1), 50);
  },
};
