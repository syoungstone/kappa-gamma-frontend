<template>
  <div class="about" id="everything">
    <div v-if="loaded">
      <h1>{{ this.className }} Pledge Class</h1>
      <h2>
        {{ (this.semester == "F" ? "Fall " : "Spring ") + " " + this.year }}
      </h2>
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
              <p>{{ hometownString(student) }}</p>
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
    this.semester = this.id.substring(0, 1);
    this.year = parseInt(this.id.substring(1));
    axios
      .get(this.$store.state.apiURL + "read_pledge_class.php?id=" + this.id, {
        headers: { Authorization: this.$store.state.jwt },
      })
      .then((response) => {
        this.students = JSON.parse(response.data.substring(1)).body;
        this.className = this.students[0].pledge_class;
        this.loaded = true;
      })
      .catch((error) => (this.error = error));
  },
  data() {
    return {
      semester: null,
      year: null,
      className: null,
      students: null,
      id: null,
      error: null,
      loaded: false,
    };
  },
  methods: {
    hometownString(student) {
      if (student.home_country == "United States of America") {
        return (
          student.hometown +
          (student.home_state ? ", " + student.home_state : "")
        );
      } else {
        return (
          student.hometown +
          (student.home_state ? ", " + student.home_state : "") +
          ", " +
          student.home_country
        );
      }
    },
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
</style>
