<template>
  <div class="about" id="narrow-wrapper">
    <h1>About</h1>
    <p>Theta Tau is a professional engineering fraternity.</p>
    <p>
      The purpose of Tehta Tau is to develop and maintain a high standard of
      professional interest among its members and to unite them in a strong bond
      of fraternal fellowhsip.
    </p>
    <p>The Kappa Gamma chapter at VCU was certified on September 9, 2000.</p>
    <h2>Our Officers</h2>
    <div v-if="loaded">
      <b-card
        v-for="officer in officers"
        :key="officer.importance"
        no-body
        class="overflow-hidden officer-card"
        style="max-width: 540px"
      >
        <b-row no-gutters>
          <b-col md="5">
            <div v-if="officer.photo" class="thumbnail">
              <img :src="officer.photo" alt="Profile photo" />
            </div>
            <div v-else class="thumbnail">
              <img src="../assets/nophoto.jpg" alt="Photo placeholder" />
            </div>
          </b-col>
          <b-col md="7">
            <b-card-body :title="officer.office" class="card-body">
              <p>
                <strong>{{
                  officer.name_first + " " + officer.name_last
                }}</strong>
              </p>
              <p>{{ officer.major + " " + officer.grad_year }}</p>
            </b-card-body>
          </b-col>
        </b-row>
      </b-card>
    </div>
    <LoadingSpinner v-else />
    <div v-if="error" class="mt-3">
      <strong>Officers could not be loaded.</strong>
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
    axios
      .get(this.$store.state.apiURL + "read_officers_public.php")
      .then((response) => {
        this.officers = response.data.body;
        this.loaded = true;
      })
      .catch((error) => {
        this.error = error;
        this.loaded = true;
      });
  },
  data() {
    return {
      officers: {},
      error: null,
      loaded: false,
    };
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
.officer-card {
  margin-top: 20px;
}
.card-body {
  margin-left: 10px;
}
</style>
