import Vue from 'vue';
import VuePipeline from 'vue-pipeline';

Vue.use(VuePipeline);

export default {
  mounted() {},
  data() {
    return {
      data: [
        {
          name: 'Start',
          hint: '1m23s',
          status: 'start',
          next: [{ index: 1, weight: 2 }],
        },
        {
          name: '',
          hint: '1m23s',
          status: 'success',
          next: [{ index: 2, weight: 0 }, { index: 4, weight: 2 }],
        },
        {
          name: '',
          hint: '2m23s',
          status: 'failure',
          next: [{ index: 3, weight: 0 }, { index: 4, weight: 0 }],
        },
        {
          name: '',
          hint: '2m23s',
          status: 'paused',
          next: [{ index: 4, weight: 0 }],
        },
        { name: '', hint: '2m23s', status: 'end', next: [] },
      ],
    };
  },
  computed: {},

  watch: {},

  methods: {},
};
