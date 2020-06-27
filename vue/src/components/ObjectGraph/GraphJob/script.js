export default {
  name: 'GraphJob',
  props: {
    status: {
      type: String,
      required: true,
    },
  },
  mounted: function() {
    console.log('job: ' + this.status);
  },
};
