<template>
  <div class="narrow-wrapper">
    <div class="row" id="name-row">
      <h1>Officers</h1>
      <b-button
        class="edit-button"
        variant="primary"
        v-if="$store.state.authTier >= AUTH_TIERS.ALL"
        @click="editOfficers()"
        >Edit</b-button
      >
    </div>
    <div v-if="loaded">
      <b-card
        v-for="officer in officers"
        :key="officer.importance"
        no-body
        class="overflow-hidden student-card"
        style="max-width: 540px"
        @click="redirect(officer.id)"
      >
        <b-row no-gutters>
          <b-col md="5">
            <ProfilePhoto :photo="officer.photo" />
          </b-col>
          <b-col md="7">
            <b-card-body :title="officer.office" class="card-body">
              <p>
                <strong>{{
                  officer.id
                    ? officer.name_first + " " + officer.name_last
                    : "VACANT"
                }}</strong>
              </p>
              <div>
                <div v-for="major in officer.majors" :key="major">
                  {{ major + " " + officer.grad_year }}
                </div>
              </div>
            </b-card-body>
          </b-col>
        </b-row>
      </b-card>
    </div>
    <LoadingSpinner v-else />
  </div>
</template>

<script>
import axios from "axios";
import { AUTH_TIERS, API_URL } from "../constants/index.js";
import ProfilePhoto from "@/components/ProfilePhoto.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
export default {
  components: {
    ProfilePhoto,
    LoadingSpinner,
  },
  created() {
    axios
      .get(API_URL + "read_officers_internal.php", {
        headers: { Authorization: this.$store.state.jwt },
      })
      .then((response) => {
        this.officers = response.data.body;
        this.parseMajors();
        this.loaded = true;
      })
      .catch((error) => {
        this.loaded = true;
        this.$root.$children[0].showError(error.response.statusText);
      });
  },
  data() {
    return {
      AUTH_TIERS: AUTH_TIERS,
      officers: null,
      loaded: false,
    };
  },
  methods: {
    redirect(id) {
      if (id != null) {
        this.$router.push("/student/" + id, () => {});
      } else {
        let modalTitle = "Position Vacant";
        let modalMessage =
          "There is no student information to display for this position.";
        this.$root.$children[0].showMessage(modalTitle, modalMessage);
      }
    },
    editOfficers() {
      this.$router.push("/editofficers", () => {});
    },
    parseMajors() {
      let i;
      for (i = 0; i < this.officers.length; i++) {
        if (this.officers[i].majors != null) {
          this.officers[i].majors = this.officers[i].majors.split(",");
        }
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
#edit-button {
  margin-left: 20px;
  margin-top: 10px;
  margin-bottom: 10px;
}
#name-row {
  justify-content: center;
}
</style>
