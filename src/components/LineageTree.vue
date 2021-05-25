<template>
  <div>
    <div id="lineage-tree"></div>
  </div>
</template>

<script>
export default {
  name: "LineageTree",
  props: {
    students: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      treantChart: null,
      lineageTree: {
        chart: {
          container: "#lineage-tree",
          connectors: {
            type: "step",
          },
        },
        nodeStructure: {},
      },
    };
  },
  mounted() {
    this.buildTree();
    this.treantChart = new window.Treant(this.lineageTree);
  },
  methods: {
    // Logic sourced from https://stackoverflow.com/questions/18017869/build-tree-array-from-flat-array-in-javascript
    buildTree() {
      var map = {},
        node,
        roots = [],
        i;

      for (i = 0; i < this.students.length; i += 1) {
        map[this.students[i].id] = i; // initialize the map
        this.students[i].children = []; // initialize the children
        this.students[i].text = {
          name: this.students[i].name_first + " " + this.students[i].name_last,
        };
        this.students[i].link = { href: "/student/" + this.students[i].id };
      }

      for (i = 0; i < this.students.length; i += 1) {
        node = this.students[i];
        if (node.big != null && map[node.big] != null) {
          this.students[map[node.big]].children.push(node);
        } else {
          roots.push(node);
        }
      }
      this.lineageTree.nodeStructure = roots[0];
    },
  },
};
</script>

<style scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
