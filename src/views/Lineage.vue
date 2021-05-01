<template>
  <div class="about" id="narrow-wrapper">
    <div v-if="loaded">
      <h1>{{ lineageName }} Lineage</h1>
      <b-card
        v-for="student in students"
        :key="student.id"
        no-body
        class="overflow-hidden student-card"
        style="max-width: 540px"
        @click="redirect(student.id)"
      >
        <b-row no-gutters>
          <b-col md="5">
            <div v-if="student.photo" class="thumbnail">
              <img :src="student.photo" alt="Profile photo" />
            </div>
            <div v-else class="thumbnail">
              <img src="../assets/nophoto.jpg" alt="Photo placeholder" />
            </div>
          </b-col>
          <b-col md="7">
            <b-card-body
              :title="student.name_first + ' ' + student.name_last"
              class="card-body"
            >
              <p>{{ student.major + " " + student.grad_year }}</p>
            </b-card-body>
          </b-col>
        </b-row>
      </b-card>
    </div>
    <LoadingSpinner v-else />
    <div v-if="error" class="mt-3">
      <strong>{{ error }}</strong>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
export default {
  components: {
    LoadingSpinner,
  },
  created() {
    this.id = this.$route.params.id;
    axios
      .get(this.$store.state.apiURL + "read_lineage.php?id=" + this.id, {
        headers: { Authorization: this.$store.state.jwt },
      })
      .then((response) => {
        console.log(response);
        this.students = response.data.body;
        this.lineageName = this.students[0].lineage_name;
        this.loaded = true;
      })
      .catch((error) => (this.error = error));
  },
  data() {
    return {
      lineageName: null,
      students: null,
      id: null,
      error: null,
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

<style>
h1 {
  text-align: left;
}
.thumbnail {
  position: relative;
  width: 200px;
  height: 200px;
  overflow: hidden;
}
.thumbnail img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}
.thumbnail img.portrait {
  width: 100%;
  height: auto;
}
.student-card {
  margin-top: 20px;
  cursor: pointer;
}
.card-body {
  margin-left: 10px;
}
#narrow-wrapper {
  max-width: 500px;
  max-height: 500px;
  padding: 20px;
  margin: 100px auto;
}
</style>
