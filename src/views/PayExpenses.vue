<template>
  <div class="narrow">
    <h2>Unpaid Expenses</h2>
  </div>
</template>

<script setup>
import axios from "axios";
import { API_URL } from "../constants/index.js";
export default {
  name: "PayExpenses",
  data() {
    return {
      loaded: false,
      expenses: null,
    };
  },
  created() {
    axios
      .get(API_URL + "read_unpaid_expenses.php")
      .then((response) => {
        this.expenses = response.data.body;
        this.loaded = true;
      })
      .catch((error) => {
        this.$root.$children[0].showError(error.response.statusText);
      });
  },
};
</script>

<style scoped></style>
