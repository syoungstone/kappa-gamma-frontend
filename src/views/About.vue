<template>
  <div class="narrow-wrapper">
    <h1>About</h1>
    <p>Theta Tau is a professional engineering fraternity.</p>
    <p>
      The purpose of Theta Tau is to develop and maintain a high standard of
      professional interest among its members and to unite them in a strong bond
      of fraternal fellowship.
    </p>
    <p>The Kappa Gamma chapter at VCU was certified on September 9, 2000.</p>
    <div v-if="loaded && error == null">
      <h2>Our Officers</h2>
      <b-card
        v-for="officer in officers"
        :key="officer.importance"
        no-body
        class="overflow-hidden student-card"
        style="max-width: 540px"
      >
        <b-row no-gutters>
          <b-col md="5">
            <ProfilePhoto :photo="officer.photo" />
          </b-col>
          <b-col md="7">
            <b-card-body :title="officer.office" class="card-body">
              <p>
                <strong>{{
                  officer.name_first + " " + officer.name_last
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
  </div>
</template>

<script>
import axios from "axios";
import { AUTH_TIERS, API_URL } from "../constants/index.js";
import ProfilePhoto from "@/components/ProfilePhoto.vue";
export default {
  components: {
    ProfilePhoto,
  },
  created() {
    axios
      .get(API_URL + "read_officers_public.php")
      .then((response) => {
        this.officers = response.data.body;
        this.parseMajors();
        this.loaded = true;
      })
      .catch((error) => {
        this.error = error.response.statusText;
        this.loaded = true;
      });
  },
  data() {
    return {
      AUTH_TIERS: AUTH_TIERS,
      officers: null,
      error: null,
      loaded: false,
    };
  },
  methods: {
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
h1,
h2,
h4 {
  text-align: left;
}
.card-body {
  margin-left: 10px;
}
</style>
