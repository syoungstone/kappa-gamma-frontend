<template>
  <div class="narrow-wrapper">
    <div v-if="loaded">
      <h1>Your Account</h1>
      <div id="balance-box">
        <h4 v-if="$store.state.authTier > AUTH_TIERS.PLEDGE && loaded">
          Account Balance:
          <div id="balance-amount" :class="balance_owed > 0 ? 'negative' : ''">
            {{ balanceString }}
          </div>
        </h4>
      </div>
      <b-table
        :items="account_entries"
        :fields="fields"
        striped
        show-empty
        responsive="sm"
      >
        <template #cell(us_date)="row">
          {{
            row.item.entry_date.substring(5, 7) +
            "/" +
            row.item.entry_date.substring(8) +
            "/" +
            row.item.entry_date.substring(2, 4)
          }}
        </template>
        <template #cell(amount_formatted)="row">
          <div :class="row.item.amount < 0 ? 'negative' : ''">
            {{
              row.item.amount >= 0
                ? "$" + Math.abs(row.item.amount).toFixed(2)
                : "($" + Math.abs(row.item.amount).toFixed(2) + ")"
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
      .get(API_URL + "read_balance_owed.php?id=" + this.$store.state.id, {
        headers: { Authorization: this.$store.state.jwt },
      })
      .then((response) => {
        this.balance_owed = response.data;
        this.loadEntries();
      })
      .catch((error) => {
        this.$root.$children[0].showError(error.response.statusText);
      });
  },
  data() {
    return {
      fields: [
        { key: "us_date", label: "Date" },
        { key: "entry_type", label: "Type" },
        { key: "amount_formatted", label: "Amount" },
      ],
      AUTH_TIERS: AUTH_TIERS,
      balance_owed: 0,
      account_entries: null,
      loaded: false,
    };
  },
  computed: {
    balanceString() {
      let amountString = "$" + Math.abs(this.balance_owed).toFixed(2);
      if (this.balance_owed > 0) {
        amountString = "(" + amountString + ")";
      }
      return amountString;
    },
  },
  methods: {
    loadEntries() {
      axios
        .get(API_URL + "read_account_entries.php?id=" + this.$store.state.id, {
          headers: { Authorization: this.$store.state.jwt },
        })
        .then((response) => {
          this.account_entries = response.data.body;
          this.loaded = true;
        })
        .catch((error) => {
          this.loaded = true;
          this.$root.$children[0].showError(error.response.statusText);
        });
    },
  },
};
</script>

<style scoped>
#balance-box {
  background-color: var(--ot-off-white);
  border-radius: 10px;
  padding: 10px;
  max-width: 60%;
  margin: auto;
  margin-top: 20px;
  margin-bottom: 20px;
}
.negative {
  color: red;
}
</style>
