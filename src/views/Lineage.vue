<template>
  <div class="narrow-wrapper">
    <div v-if="loaded">
      <h1>{{ lineageName }} Lineage</h1>
      <LineageTree :students="students" />
    </div>
    <LoadingSpinner v-else />
  </div>
</template>

<script>
import axios from "axios";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import LineageTree from "@/components/LineageTree.vue";
export default {
  components: {
    LoadingSpinner,
    LineageTree,
  },
  created() {
    this.id = this.$route.params.id;
    axios
      .get(this.$store.state.apiURL + "read_lineage.php?id=" + this.id, {
        headers: { Authorization: this.$store.state.jwt },
      })
      .then((response) => {
        this.students = response.data.body;
        this.lineageName = this.students[0].lineage_name;
        this.loaded = true;
      })
      .catch((error) =>
        this.$root.$children[0].showError(error.response.statusText)
      );
  },
  data() {
    return {
      lineageName: null,
      students: null,
      id: null,
      loaded: false,
    };
  },
  methods: {
    redirect(id) {
      this.$router.push("/student/" + id, () => {});
    },
  },
};
</script>
