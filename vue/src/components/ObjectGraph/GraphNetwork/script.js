import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';

cytoscape.use(dagre);

export default {
  props: {
    elements: {
      type: Object,
      required: true,
    },
  },
  mounted: function() {
    console.log('network');
    // const cy1 = cytoscape({
    cytoscape({
      container: document.getElementById('cy'),
      elements: this.elements,
      layout: {
        name: 'dagre',
      },
      style: [
        // what a node looks like?
        {
          selector: 'node',
          style: {
            content: 'data(name)',
            'text-valign': 'center',
            'text-halign': 'right',
            'background-color': '#ededed',
          },
        },
        // what an edge looks like?
        {
          selector: 'edge',
          style: {
            'curve-style': 'bezier',
            width: 1,
            'target-arrow-shape': 'triangle',
            'line-color': '#333333',
            'target-arrow-color': '#333333',
          },
        },
      ],
    });

    // cy1.nodeHtmlLabel([
    //   {
    //     query: 'node',
    //     tpl: function(data) {
    //       return `<div id="${data.id}"></div>`;
    //     },
    //   },
    // ]);
  },
};
