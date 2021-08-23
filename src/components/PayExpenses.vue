<template>
  <div class="narrow">
    <h2>Unpaid Expenses</h2>
    <b-table
      v-if="loaded"
      :items="expenses"
      :fields="fields"
      striped
      responsive="sm"
    >
      <template #cell(us_date)="row">
        {{
          row.item.expense_date.substring(5, 7) +
          "/" +
          row.item.expense_date.substring(8) +
          "/" +
          row.item.expense_date.substring(2, 4)
        }}
      </template>
      <template #cell(expense)="row">
        <router-link :to="'/expense/' + row.item.id">{{
          row.item.reason
        }}</router-link>
      </template>
      <template #cell(amount)="row">
        <div class="negative">
          {{ "($" + row.item.amount + ")" }}
        </div>
      </template>
    </b-table>
  </div>
</template>

<script setup>
import axios from "axios";
import { API_URL } from "../constants/index.js";
export default {
  name: "PayExpenses",
  props: ["doReset"],
  data() {
    return {
      fields: [
        { key: "us_date", label: "Date" },
        { key: "expense" },
        { key: "amount" },
      ],
      loaded: false,
      expenses: null,
    };
  },
  created() {
    this.load();
  },
  watch: {
    doReset(newVal) {
      if (newVal) {
        this.load();
      }
    },
  },
  methods: {
    load() {
      axios
        .get(API_URL + "read_unpaid_expenses.php")
        .then((response) => {
          this.expenses = response.data.body;
          this.loaded = true;
          this.$emit("resetDone");
        })
        .catch((error) => {
          this.$root.$children[0].showError(error.response.statusText);
        });
    },
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
