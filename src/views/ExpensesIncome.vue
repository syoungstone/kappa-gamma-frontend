<template>
  <div class="medium-wrapper">
    <h1>Expenses &amp; Income</h1>
    <b-card no-body>
      <b-tabs card>
        <b-tab title="Unpaid Expenses" active>
          <PayExpenses :doReset="doReset" @resetDone="doReset = false" />
        </b-tab>
        <b-tab title="Report Expense">
          <ExpenseForm @doReset="doReset = true" />
        </b-tab>
        <b-tab title="Report Income">
          <IncomeForm />
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
import PayExpenses from "@/components/PayExpenses.vue";
import ExpenseForm from "@/components/ExpenseForm.vue";
import IncomeForm from "@/components/IncomeForm.vue";
export default {
  components: {
    PayExpenses,
    ExpenseForm,
    IncomeForm,
  },
  data() {
    return {
      doReset: false,
    };
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
