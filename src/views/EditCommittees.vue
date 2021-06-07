<template>
  <div class="narrow-wrapper">
    <h1>Edit Committees</h1>
    <div v-if="loaded">
      <b-card
        v-for="committee in committees"
        :key="committee.committee_id"
        no-body
        class="mb-1"
      >
        <b-card-header class="p-1" header-tag="header" role="tab">
          <div
            class="card-header-content"
            v-b-toggle="'content-' + committee.committee_id"
          >
            <b-icon-caret-down-fill
              class="when-closed"
            ></b-icon-caret-down-fill>
            <b-icon-caret-up-fill class="when-open"></b-icon-caret-up-fill>
            <strong>{{ " " + committee.committee_name }}</strong>
          </div>
          <b-button variant="danger">Delete</b-button>
        </b-card-header>
        <b-collapse :id="'content-' + committee.committee_id" role="tabpanel">
          <b-card-body>
            <b-card-text
              >I start opened because <code>visible</code> is
              <code>true</code></b-card-text
            >
          </b-card-body>
        </b-collapse>
      </b-card>
    </div>
    <LoadingSpinner v-else />
  </div>
</template>

<script>
import axios from "axios";
import { AUTH_TIERS, API_URL } from "../constants/index.js";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
export default {
  components: {
    LoadingSpinner,
  },
  created() {
    axios
      .get(API_URL + "read_committee_members.php", {
        headers: { Authorization: this.$store.state.jwt },
      })
      .then((response) => {
        this.committees = response.data.body;
        console.log(this.committees);
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
      committees: null,
      loaded: false,
    };
  },
};
</script>

<style scoped>
.p-1 {
  display: flex;
}
.card-header-content {
  cursor: pointer;
  padding: 10px;
  width: 100%;
}
.collapsed > .when-open,
.not-collapsed > .when-closed {
  display: none;
}
</style>
