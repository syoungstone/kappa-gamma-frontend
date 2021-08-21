<template>
  <div>
    <h2>Brother Account Balances</h2>
    <b-table
      v-if="loaded"
      class="b-table"
      striped
      hover
      :items="brothers"
      :fields="fields"
      stacked="md"
      show-empty
    >
      <template #cell(roll_number)="row">
        <b-link :to="'/account/' + row.item.id">
          {{ row.item.roll_number }}
        </b-link>
      </template>
      <template #cell(balance)="row">
        <div :class="row.item.balance_owed > 0 ? 'negative' : ''">
          {{
            row.item.balance_owed > 0
              ? "($" + Math.abs(row.item.balance_owed).toFixed(2) + ")"
              : "$" + Math.abs(row.item.balance_owed).toFixed(2)
          }}
        </div>
      </template>
    </b-table>
  </div>
</template>

<script>
import axios from "axios";
import { API_URL } from "../constants/index.js";
export default {
  name: "StudentAccounts",
  data() {
    return {
      loaded: false,
      brothers: null,
      fields: [
        {
          key: "roll_number",
          label: "Roll",
          sortable: true,
        },
        {
          key: "name_last",
          label: "Last Name",
          sortable: true,
        },
        { key: "name_first", label: "First Name" },
        { key: "balance", sortable: true },
      ],
    };
  },
  created() {
    axios
      .get(API_URL + "read_balance_owed.php", {
        headers: { Authorization: this.$store.state.jwt },
      })
      .then((response) => {
        console.log(response);
        this.brothers = response.data.body;
        this.loaded = true;
      })
      .catch((error) =>
        this.$root.$children[0].showError(error.response.statusText)
      );
  },
};
</script>

<style scoped>
h2 {
  margin-bottom: 20px;
}
.negative {
  color: red;
}
</style>
