<template>
  <div class="narrow-wrapper">
    <div class="row" id="name-row">
      <h1>Committees</h1>
      <b-button
        class="edit-button"
        variant="primary"
        v-if="$store.state.authTier >= AUTH_TIERS.OFFICER"
        @click="editCommittees()"
        >Edit</b-button
      >
    </div>
    <div v-if="loaded">
      <b-table :items="committees" :fields="fields" striped responsive="sm">
        <template #cell(committee)="row">
          <router-link :to="'/committee/' + row.item.committee_id">{{
            row.item.committee_name
          }}</router-link>
        </template>
        <template #cell(chair)="row">
          <router-link
            v-if="row.item.chair_name"
            :to="'/student/' + row.item.chair_id"
            >{{ row.item.chair_name }}</router-link
          >
          <div v-else>VACANT</div>
        </template>
        <template #cell(budget)="row">
          {{ "$" + row.item.amount_budgeted.toFixed(2) }}
        </template>
        <template #cell(balance)="row">
          <div
            :class="
              row.item.amount_budgeted +
                row.item.amount_collected -
                row.item.amount_spent <
              0
                ? 'negative'
                : ''
            "
          >
            {{
              getBalanceString(
                row.item.amount_budgeted +
                  row.item.amount_collected -
                  row.item.amount_spent
              )
            }}
          </div>
        </template>
      </b-table>
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
      .get(API_URL + "read_committees.php", {
        headers: { Authorization: this.$store.state.jwt },
      })
      .then((response) => {
        this.committees = response.data.body;
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
      fields: [
        { key: "committee" },
        { key: "chair" },
        { key: "budget" },
        { key: "balance" },
      ],
      loaded: false,
    };
  },
  methods: {
    editCommittees() {
      this.$router.push("/editcommittees", () => {});
    },
    getBalanceString(amount) {
      let amountString = "$" + Math.abs(amount).toFixed(2);
      if (amount < 0) {
        amountString = "(" + amountString + ")";
      }
      return amountString;
    },
  },
};
</script>

<style scoped>
h4 {
  text-align: left;
}
.negative {
  color: red;
}
#edit-button {
  margin-left: 20px;
  margin-top: 10px;
  margin-bottom: 10px;
}
#name-row {
  justify-content: center;
  margin-bottom: 20px;
}
</style>
