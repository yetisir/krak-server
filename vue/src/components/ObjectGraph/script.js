import * as d3_base from 'd3';
import * as d3_dag from 'd3-dag';

// This just merges the two libraries together into one
// access point
const d3 = Object.assign({}, d3_base, d3_dag);

export default {
  data() {
    return {
      id: 'objectGraph',
      canvas: null,
      dag: null,
      overlay: true,
      data: [
        {
          id: 'Eve',
        },
        {
          id: 'Cain',
          parentIds: ['Eve'],
        },
        {
          id: 'Seth',
          parentIds: [],
        },
        {
          id: 'Enos',
          parentIds: ['Seth'],
        },
        {
          id: 'Noam',
          parentIds: ['Seth'],
        },
        {
          id: 'Abel',
          parentIds: ['Eve', 'Azura'],
        },
        {
          id: 'Awan',
          parentIds: ['Eve'],
        },
        {
          id: 'Enoch',
          parentIds: ['Eve', 'Enos'],
        },
        {
          id: 'Azura',
          parentIds: ['Eve', 'Cain'],
        },
      ],
    };
  },
  mounted() {
    this.canvas = d3
      .select(`#${this.id}`)
      .attr('width', this.$refs.overlay.height)
      .attr('height', this.$refs.overlay.width);

    this.calculateDAG();
    this.plotDAG();
  },
  methods: {
    calculateDAG() {
      this.dag = d3.dagStratify()(this.data);

      const layout = d3
        .sugiyama()
        .size([
          this.$refs.graph.clientWidth * 0.8,
          this.$refs.graph.clientHeight * 0.8,
        ])
        .layering(d3.layeringSimplex())
        .decross(d3.decrossOpt())
        .coord(d3.coordVert());

      layout(this.dag);
    },
    plotDAG() {
      const defs = this.canvas.append('defs');
      const steps = this.dag.size();
      const interp = d3.interpolateRainbow;
      const colorMap = {};
      this.dag.each((node, i) => {
        colorMap[node.id] = interp(i / steps);
      });

      // plot lines
      const line = d3
        .line()
        .curve(d3.curveCatmullRom)
        .x((d) => d.x)
        .y((d) => d.y);

      this.canvas
        .append('g')
        .selectAll('path')
        .data(this.dag.links())
        .enter()
        .append('path')
        .attr('d', ({ data }) => line(data.points))
        .attr('fill', 'none')
        .attr('stroke-width', 3)
        .attr('stroke', ({ source, target }) => {
          const gradId = `${source.id}-${target.id}`;
          const grad = defs
            .append('linearGradient')
            .attr('id', gradId)
            .attr('gradientUnits', 'userSpaceOnUse')
            .attr('x1', source.x)
            .attr('x2', target.x)
            .attr('y1', source.y)
            .attr('y2', target.y);
          grad
            .append('stop')
            .attr('offset', '0%')
            .attr('stop-color', colorMap[source.id]);
          grad
            .append('stop')
            .attr('offset', '100%')
            .attr('stop-color', colorMap[target.id]);
          return `url(#${gradId})`;
        });
      // Select nodes
      const nodes = this.canvas
        .append('g')
        .selectAll('g')
        .data(this.dag.descendants())
        .enter()
        .append('g')
        .attr('transform', ({ x, y }) => `translate(${x}, ${y})`);

      // Plot node circles
      const nodeRadius = 20;

      nodes
        .append('circle')
        .attr('r', nodeRadius)
        .attr('fill', (n) => colorMap[n.id]);

      const arrow = d3
        .symbol()
        .type(d3.symbolTriangle)
        .size((nodeRadius * nodeRadius) / 5.0);
      this.canvas
        .append('g')
        .selectAll('path')
        .data(this.dag.links())
        .enter()
        .append('path')
        .attr('d', arrow)
        .attr('transform', ({ source, target, data }) => {
          const [end, start] = data.points.reverse();
          // This sets the arrows the node radius (20) + a little bit (3) away from the node center, on the last line segment of the edge. This means that edges that only span ine level will work perfectly, but if the edge bends, this will be a little off.
          const dx = start.x - end.x;
          const dy = start.y - end.y;
          const scale = (nodeRadius * 1.15) / Math.sqrt(dx * dx + dy * dy);
          // This is the angle of the last line segment
          const angle = (Math.atan2(-dy, -dx) * 180) / Math.PI + 90;
          console.log(angle, dx, dy);
          return `translate(${end.x + dx * scale}, ${end.y +
            dy * scale}) rotate(${angle})`;
        })
        .attr('fill', ({ target }) => colorMap[target.id])
        .attr('stroke', 'white')
        .attr('stroke-width', 1.5);

      // Add text to nodes
      nodes
        .append('text')
        .text((d) => d.id)
        .attr('font-weight', 'bold')
        .attr('font-family', 'sans-serif')
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .attr('fill', 'white');
    },
  },
};
