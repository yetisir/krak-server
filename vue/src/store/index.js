// import Vue from 'vue';
import Vue from 'vue';
import Vuex from 'vuex';

import busy from '@/store/busy';
import code from '@/store/code';
import network from '@/store/network';
import view from '@/store/view';
import vtk from '@/store/vtk';
import ui from '@/store/ui';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    busy,
    code,
    network,
    view,
    vtk,
    ui,
  },
});
