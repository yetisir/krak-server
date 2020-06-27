// job/task statuses
const statuses = ['running', 'succeeded', 'failed'];

// return a random status
function randomStatus() {
  return statuses[Math.floor(Math.random() * statuses.length)];
}

// let's modify the statuses every 3 seconds
setInterval(function() {
  const workflow = graphqlResponse.data.workflows[0];
  workflow.nodesEdges.nodes.map((node) => {
    if (
      Object.hasOwnProperty.call(node, 'state') &&
      node.state !== undefined &&
      node.state !== ''
    ) {
      node.state = randomStatus();
    }
  });
}, 3000);

// IMPORTANT: we must be able to use the following Job component in the graph, being able to also changing its status so that this is reflected in the graph

// simplified Job component from Cylc
const Job = Vue.component('job', {
  name: 'Job',
  props: {
    status: {
      type: String,
      required: true,
    },
  },
  template: `<span
      class="c-job"
      style="display:inline-block; vertical-align:middle"
    >
      <svg
        class="job"
        v-bind:class="[status]"
        viewBox="0 0 100 100"
      >
        <rect
          x="10" y="10"
          width="80" height="80"
          rx="20" ry="20"
          stroke-width="10"
        />
      </svg>
    </span>`,
});

const GraphNode = Vue.component('graph-node', {
  name: 'GraphNode',
  components: {
    job: Job,
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
      handler(newValue, oldValue) {
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
  template: `<span>
    <job :status="node.state" />
  </span>`,
});

Vue.component('network', {
  props: {
    elements: {
      type: Array,
      required: true,
    },
  },
  template: '<div id="cy" class="cy"></div>',
  mounted: function() {
    const cy1 = cytoscape({
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

    cy1.nodeHtmlLabel([
      {
        query: 'node',
        tpl: function(data) {
          return `<div id="${data.id}"></div>`;
        },
      },
    ]);
  },
});

// le Vue app
const vm = new Vue({
  el: '#app',
  components: {
    job: Job,
  },
  data() {
    return {
      queryResponse: graphqlResponse,
    };
  },
  computed: {
    workflow: function() {
      return this.queryResponse.data.workflows[0];
    },
    nodes: function() {
      return this.workflow.nodesEdges.nodes;
    },
    elements: function() {
      // structure used by cytoscape
      const elements = {
        nodes: [],
        edges: [],
      };

      // I thought nodes would contain all the valid nodes, but it looks like some are only
      // available in the edges section (as target/source), so we loop twice to populate
      // all the nodes
      this.workflow.nodesEdges.nodes.map((node) => {
        elements.nodes.push({
          data: {
            id: node.id,
            name: node.task.name, // used to display the value in the graph,
            status: node.state,
          },
        });
      });
      this.workflow.nodesEdges.edges.map((edge) => {
        elements.nodes.push({
          data: {
            id: edge.source,
          },
        });
        elements.nodes.push({
          data: {
            id: edge.target,
          },
        });
      });

      // then we add all the edges
      this.workflow.nodesEdges.edges.map((edge) => {
        elements.edges.push({
          data: {
            source: edge.source,
            target: edge.target,
          },
        });
      });
      return elements;
    },
  },
});
window.vm = vm;
