<template>
  <div class="medium-wrapper">
    <h1>Dues &amp; Fines</h1>
    <b-card no-body>
      <b-tabs card>
        <b-tab title="Student Accounts" active>
          <StudentAccounts :brothers="brothers" :loaded="loaded" />
        </b-tab>
        <b-tab title="Assess Dues">
          <AssessDues @doReset="load()" />
        </b-tab>
        <b-tab title="Report Payment">
          <ReportPayment @doReset="load()" />
        </b-tab>
        <b-tab title="Report Fine">
          <ReportFine @doReset="load()" />
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
import axios from "axios";
import { API_URL } from "../constants/index.js";
import AssessDues from "@/components/AssessDues.vue";
import ReportFine from "@/components/ReportFine.vue";
import ReportPayment from "@/components/ReportPayment.vue";
import StudentAccounts from "@/components/StudentAccounts.vue";
export default {
  components: {
    AssessDues,
    ReportFine,
    ReportPayment,
    StudentAccounts,
  },
  data() {
    return {
      brothers: [],
      loaded: false,
    };
  },
  created() {
    this.load();
  },
  methods: {
    load() {
      axios
        .get(API_URL + "read_balance_owed.php", {
          headers: { Authorization: this.$store.state.jwt },
        })
        .then((response) => {
          this.brothers = response.data.body;
          this.loaded = true;
        })
        .catch((error) =>
          this.$root.$children[0].showError(error.response.statusText)
        );
    },
  },
};
</script>

<style scoped>
h1 {
  margin-bottom: 20px;
}
.card {
  background-color: white !important;
  box-shadow: none;
}
.tab-pane {
  padding: 50px;
}
</style>
