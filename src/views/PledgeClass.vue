<template>
  <div class="narrow-wrapper">
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
            <ProfilePhoto :photo="student.photo" />
          </b-col>
          <b-col md="7">
            <b-card-body
              :title="student.name_first + ' ' + student.name_last"
              class="card-body"
            >
              <div>
                <div v-for="major in student.majors" :key="major">
                  {{ major + " " + student.grad_year }}
                </div>
              </div>
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
import ProfilePhoto from "@/components/ProfilePhoto.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
export default {
  components: {
    ProfilePhoto,
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
        this.students = response.data.body;
        this.className = this.students[0].pledge_class;
        this.parseMajors();
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
    parseMajors() {
      let i;
      for (i = 0; i < this.students.length; i++) {
        this.students[i].majors = this.students[i].majors.split(",");
      }
    },
  },
};
</script>

<style scoped>
h4 {
  text-align: left;
}
.student-card {
  cursor: pointer;
}
.card-body {
  margin-left: 10px;
}
</style>
