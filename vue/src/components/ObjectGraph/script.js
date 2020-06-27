// import cytoscape from 'cytoscape';
// import jquery from 'jquery';
// import contextMenus from 'cytoscape-context-menus';
// import 'cytoscape-context-menus/cytoscape-context-menus.css';

export default {
  // components: {
  //   GraphJob,
  //   GraphNetwork,
  //   GraphNode,
  // },
  data() {
    return {
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#666',
            label: 'data(id)',
          },
        },
        {
          selector: 'edge',
          style: {
            width: 3,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle',
          },
        },
      ],
      layout: {
        name: 'grid',
        rows: 1,
      },
      elements: [
        { data: { id: 'a' } },
        { data: { id: 'b' } },
        { data: { id: 'ab', source: 'a', target: 'b' } },
      ],
    };
  },
  computed: {
    config: function() {
      return {
        style: this.style,
        layout: this.layout,
        elements: this.elements,
      };
    },
  },
  methods: {
    preConfig: function() {
      // contextMenus(cytoscape, jquery);
      // cytoscape.use(jquery);
    },
    afterCreated: function(cy) {
      // cy.contextMenus({
      //   menuItems: [
      //     {
      //       id: 'remove',
      //       content: 'remove',
      //       tooltipText: 'remove',
      //       image: { src: 'remove.svg', width: 12, height: 12, x: 6, y: 4 },
      //       selector: 'node, edge',
      //       onClickFunction: function(event) {
      //         var target = event.target || event.cyTarget;
      //         target.remove();
      //       },
      //       hasTrailingDivider: true,
      //     },
      //     {
      //       id: 'hide',
      //       content: 'hide',
      //       tooltipText: 'hide',
      //       selector: '*',
      //       onClickFunction: function(event) {
      //         var target = event.target || event.cyTarget;
      //         target.hide();
      //       },
      //       disabled: false,
      //     },
      //   ],
      // });
    },
  },
};
