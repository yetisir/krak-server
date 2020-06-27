// Import polyfills
import 'core-js/modules/es7.promise.finally';
import 'core-js/modules/web.immediate';

import Vue from 'vue';
import Vuex from 'vuex';
import Vuetify from 'vuetify';
import VueCytoscape from 'vue-cytoscape';

import app from '@/app';
import store from '@/store';

import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuex);
Vue.use(Vuetify);
Vue.use(VueCytoscape);

new Vue({
  store,
  vuetify: new Vuetify({ theme: { dark: true } }),
  render: (h) => h(app),
}).$mount('#app');
