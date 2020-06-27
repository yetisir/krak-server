import Vue from 'vue';
import GraphJob from '@/components/ObjectGraph/GraphJob';

export default {
  name: 'GraphNode',
  components: {
    GraphJob,
  },
  props: {
    node: {
      type: Object,
      required: true,
    },
  },
  watch: {
    node: {
      immediate: true,
      deep: true,
      handler(newValue) {
        const nodeElem = document.getElementById(newValue.id);
        const vm = this;
        if (nodeElem) {
          Vue.nextTick(function() {
            nodeElem.innerHTML = vm.$mount().$el.outerHTML;
          });
        }
      },
    },
  },
  mounted: function() {
    console.log('node');
  },
};
