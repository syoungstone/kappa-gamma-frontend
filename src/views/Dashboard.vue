<template>
  <div class="narrow-wrapper">
    <h1>
      Welcome
      {{ $store.state.authTier > AUTH_TIERS.PLEDGE ? "Brother" : "Pledge" }}
      {{ $store.state.lastName }}!
    </h1>
    <div
      v-if="$store.state.authTier > AUTH_TIERS.PLEDGE && loaded"
      id="balance-box"
      @click="accountRedirect"
    >
      <h4>
        Account Balance:
        <div id="balance-amount" :class="balance_owed > 0 ? 'negative' : ''">
          {{ balanceString }}
        </div>
      </h4>
    </div>
    <EventList @event-selected="eventSelected" />
  </div>
</template>

<script>
import axios from "axios";
import EventList from "@/components/EventList.vue";
import { API_URL, AUTH_TIERS } from "../constants/index.js";
export default {
  created() {
    if (this.$store.state.authTier > AUTH_TIERS.PLEDGE) {
      axios
        .get(API_URL + "read_balance_owed.php?id=" + this.$store.state.id, {
          headers: { Authorization: this.$store.state.jwt },
        })
        .then((response) => {
          this.balance_owed = response.data;
          this.loaded = true;
        })
        .catch((error) => {
          this.$root.$children[0].showError(error.response.statusText);
        });
    }
  },
  data() {
    return {
      AUTH_TIERS: AUTH_TIERS,
      balance_owed: 0,
      loaded: false,
    };
  },
  computed: {
    showBalance() {
      return this.$store.state.authTier > AUTH_TIERS.PLEDGE;
    },
    balanceString() {
      let amountString = "$" + Math.abs(this.balance_owed).toFixed(2);
      if (this.balance_owed > 0) {
        amountString = "(" + amountString + ")";
      }
      return amountString;
    },
  },
  components: {
    EventList,
  },
  methods: {
    eventSelected(id) {
      this.$router.push("/event/" + id, () => {});
    },
    accountRedirect() {
      this.$router.push("/account", () => {});
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
  cursor: pointer;
}
.negative {
  color: red;
}
</style>
