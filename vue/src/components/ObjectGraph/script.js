import { mapGetters } from 'vuex';

import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';

cytoscape.use(dagre);

export default {
  data() {
    return {
      // show: false,
      // cy: null,
      // overlay: true,
      // graph: null,
      style: cytoscape
        .stylesheet()
        .selector('node')
        .css({
          shape: 'data(faveShape)',
          width: 'mapData(weight, 40, 80, 20, 60)',
          content: 'data(name)',
          'text-valign': 'center',
          'text-outline-width': 2,
          'text-outline-color': 'data(faveColor)',
          'background-color': 'data(faveColor)',
          color: '#fff',
        })
        .selector(':selected')
        .css({
          'border-width': 3,
          'border-color': '#333',
        })
        .selector('edge')
        .css({
          'curve-style': 'bezier',
          opacity: 0.666,
          width: 'mapData(strength, 70, 100, 2, 6)',
          'target-arrow-shape': 'triangle',
          'source-arrow-shape': 'circle',
          'line-color': 'data(faveColor)',
          'source-arrow-color': 'data(faveColor)',
          'target-arrow-color': 'data(faveColor)',
        })
        .selector('edge.questionable')
        .css({
          'line-style': 'dotted',
          'target-arrow-shape': 'diamond',
        })
        .selector('.faded')
        .css({
          opacity: 0.25,
          'text-opacity': 0,
        }),
      layout: {
        name: 'dagre',
        padding: 10,
      },
      elements: {
        nodes: [
          {
            data: {
              id: 'j',
              name: 'Jerry',
              weight: 65,
              faveColor: '#6FB1FC',
              faveShape: 'triangle',
            },
          },
          {
            data: {
              id: 'e',
              name: 'Elaine',
              weight: 45,
              faveColor: '#EDA1ED',
              faveShape: 'ellipse',
            },
          },
          {
            data: {
              id: 'k',
              name: 'Kramer',
              weight: 75,
              faveColor: '#86B342',
              faveShape: 'octagon',
            },
          },
          {
            data: {
              id: 'g',
              name: 'George',
              weight: 70,
              faveColor: '#F5A45D',
              faveShape: 'rectangle',
            },
          },
        ],
        edges: [
          {
            data: {
              source: 'j',
              target: 'e',
              faveColor: '#6FB1FC',
              strength: 90,
            },
          },
          {
            data: {
              source: 'j',
              target: 'k',
              faveColor: '#6FB1FC',
              strength: 70,
            },
          },
          {
            data: {
              source: 'j',
              target: 'g',
              faveColor: '#6FB1FC',
              strength: 80,
            },
          },

          {
            data: {
              source: 'e',
              target: 'j',
              faveColor: '#EDA1ED',
              strength: 95,
            },
          },
          {
            data: {
              source: 'e',
              target: 'k',
              faveColor: '#EDA1ED',
              strength: 60,
            },
            classes: 'questionable',
          },

          {
            data: {
              source: 'k',
              target: 'j',
              faveColor: '#86B342',
              strength: 100,
            },
          },
          {
            data: {
              source: 'k',
              target: 'e',
              faveColor: '#86B342',
              strength: 100,
            },
          },
          {
            data: {
              source: 'k',
              target: 'g',
              faveColor: '#86B342',
              strength: 100,
            },
          },

          {
            data: {
              source: 'g',
              target: 'j',
              faveColor: '#F5A45D',
              strength: 90,
            },
          },
        ],
      },
    };
  },
  computed: {
    ...mapGetters(['UI_OBJECT_GRAPH_SET']),
    config: function() {
      return {
        style: this.style,
        layout: this.layout,
        // elements: this.elements,
      };
    },
    show: {
      get: function() {
        return this.$store.getters.UI_OBJECT_GRAPH;
      },
      set: function(value) {
        this.$store.commit('UI_OBJECT_GRAPH_SET', value);
      },
    },
    // elements: function() {
    //   return this.$store.getters.VTK_OBJECTS;
    // },
  },
  mounted: function() {
    // console.log('test');
    // this.cy = cytoscape({
    //   container: this.$refs.cy.$el,
    //   layout: this.layout,
    //   style: this.style,
    //   elements: this.elements,
    // });
  },
  watch: {
    show(newValue) {
      console.log(newValue);
      if (!newValue) {
        // Temp hack to remove graph render
        this.cy.remove('_none');
      } else {
        this.cy = cytoscape({
          container: this.$refs.cy.$el,
          layout: this.layout,
          style: this.style,
          elements: this.elements,
        });
      }
    },
  },
  methods: {
    //     // addNode(event) {
    //     //   console.log(event.target, this.$refs.cyRef.instance);
    //     //   if (event.target === this.$refs.cyRef.instance)
    //     //     console.log('adding node', event.target);
    //     // },
    //     // deleteNode(id) {
    //     //   console.log('node clicked', id);
    //     // },
    //     // updateNode(event) {
    //     //   console.log('right click node', event);
    //     // },
    //     // preConfig(cytoscape) {
    //     //   console.log('calling pre-config', cytoscape);
    //     // },
    //     // afterCreated(cy) {
    //     //   // cy: this is the cytoscape instance
    //     //   console.log('after created', cy);
  },
};
