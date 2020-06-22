// Import polyfills
import 'core-js/modules/es7.promise.finally';
import 'core-js/modules/web.immediate';

import Vue from 'vue';
import Vuetify from 'vuetify';

import app from '@/components/core/App';
import store from '@/store';

import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify);

new Vue({
  store,
  vuetify: new Vuetify({ theme: { dark: true } }),
  render: (h) => h(app),
}).$mount('#app');
