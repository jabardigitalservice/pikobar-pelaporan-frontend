<template>
  <v-card class="chart mx-auto" outlined>
    <v-card-text id="case" class="pa-0" style="height: 450px;">
      <div id="svg-container" />
    </v-card-text>
  </v-card>
</template>

<script>
import * as d3 from 'd3'
import jsonCase from '../../../json/graph.json'

export default {
  name: 'GraphCase',
  data() {
    return {
      jsonCase,
      height: 450,
      width: 800
    }
  },
  mounted() {
    this.renderGraph()
  },
  methods: {
    color() {
      const scale = d3.scaleOrdinal(d3.schemeCategory10)
      return d => scale(d.group)
    },
    drag(simulation) {
      function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart()
        d.fx = d.x
        d.fy = d.y
      }

      function dragged(d) {
        d.fx = d3.event.x
        d.fy = d3.event.y
      }

      function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0)
        d.fx = null
        d.fy = null
      }

      return d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
    },
    linkDistance() {
      return 2
    },
    renderGraph() {
      const links = this.jsonCase.links.map(d => Object.create(d))
      const nodes = this.jsonCase.nodes.map(d => Object.create(d))

      // Simulation
      const simulation = d3
        .forceSimulation(nodes)
        .force('link', d3.forceLink(links).id(d => d.id))
        .force('charge', d3.forceManyBody().strength(-50))
        .force('x', d3.forceX())
        .force('y', d3.forceY())

      // Create SVG
      const svg = d3
        .select('#svg-container')
        .append('svg')
        .attr('width', '100%')
        .attr('height', this.height)
        .attr('viewBox', [-this.width / 2, -this.height / 2, this.width, this.height])

      // Create G
      var g = svg
        .append('g')
        .attr('class', 'everything')

      // Zoom
      var zoom_handler = d3
        .zoom()
        .on('zoom', () => {
          g.attr('transform', d3.event.transform)
        })
      zoom_handler(svg)

      const link = g
        .append('g')
        .attr('stroke', '#999')
        .attr('stroke-opacity', 0.6)
        .selectAll('line')
        .data(links)
        .join('line')
        .attr('stroke-width', d => Math.sqrt(d.value))
        .attr('class', 'node')

      const gNode = g
        .append('g')

      const node = gNode
        .selectAll('circle')
        .data(nodes)
        .join('g')
        .attr('class', 'node')
        .call(this.drag(simulation))

      node.append('image')
        .attr('xlink:href', function(d) {
          return d.image
        })
        .attr('x', -5)
        .attr('y', -5)
        .attr('width', 10)
        .attr('height', 10)

      node
        .append('title')
        .text(d => d.id)

      // node
      //   .append('text')
      //   .attr('x', 0)
      //   .attr('dy', 12)
      //   .attr('text-anchor', 'middle')
      //   .text(function(d) { return d.id })

      simulation.on('tick', () => {
        link
          .attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y)

        node.attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')' })
      })
    }
  }
}
</script>

<style scoped>
.node text {
  pointer-events: none;
  font: 4px sans-serif;
}
</style>
