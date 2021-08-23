<template>
  <div class="narrow">
    <h2>Report Expense</h2>
    <b-form v-if="loaded" @submit.prevent="onSubmit">
      <b-form-group label="Name:">
        <b-input v-model="expense.reason" required></b-input>
      </b-form-group>

      <b-form-group label="Amount:">
        <b-input-group prepend="$">
          <b-form-input
            type="number"
            step="0.01"
            min="0"
            v-model="expense.amount"
            required
          ></b-form-input>
        </b-input-group>
      </b-form-group>

      <b-form-group label="Line item:">
        <b-form-select
          v-model="expense.line_item"
          :options="lineItems"
          value-field="line_item_id"
          text-field="line_item_name"
          required
        ></b-form-select>
      </b-form-group>

      <b-form-group label="Date of expense:">
        <b-form-datepicker
          v-model="expense.expense_date"
          :date-format-options="{
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
          }"
          required
        >
        </b-form-datepicker>
      </b-form-group>

      <div
        id="payment-date"
        v-if="$store.state.authTier >= AUTH_TIERS.FINANCIAL"
      >
        <b-form-checkbox v-model="hasBeenPaid">
          Chapter has already paid for this expense
        </b-form-checkbox>
        <b-form-group
          v-if="hasBeenPaid"
          id="payment-datepicker"
          label="Date of payment:"
        >
          <b-form-datepicker
            v-model="paymentDate"
            :date-format-options="{
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
            }"
            required
          >
          </b-form-datepicker>
        </b-form-group>
      </div>

      <b-form-group label="Description (optional):">
        <b-form-textarea
          v-model="expense.explanation"
          placeholder="Please provide any necessary context..."
        ></b-form-textarea>
      </b-form-group>

      <b-form-group label="Party owed (optional):">
        <b-form-textarea
          v-model="expense.party_owed"
          placeholder="Please specify who, if anyone, needs to be reimbursed..."
        ></b-form-textarea>
      </b-form-group>

      <h5>Please select which semester's budget to apply this payment to:</h5>
      <div class="row justify-content-center">
        <b-form-group id="semester" label="Semester:">
          <b-form-select
            :options="[
              { text: 'Fall', value: 'F' },
              { text: 'Spring', value: 'S' },
            ]"
            v-model="expense.semester"
            required
          ></b-form-select>
        </b-form-group>
        <b-form-group id="year" label="Year:">
          <b-form-input
            id="year-select"
            type="number"
            v-model="expense.accounting_year"
            required
          ></b-form-input>
        </b-form-group>
        <b-button
          class="submit-button"
          type="submit"
          variant="primary"
          :disabled="expense.amount <= 0"
          >Submit</b-button
        >
      </div>
    </b-form>
  </div>
</template>

<script>
import axios from "axios";
import { AUTH_TIERS, API_URL } from "../constants/index.js";
export default {
  name: "ReportPayment",
  data() {
    return {
      AUTH_TIERS: AUTH_TIERS,
      loaded: false,
      hasBeenPaid: false,
      lineItems: null,
      paymentDate: null,
      expense: {
        reason: null,
        reported_by: null,
        line_item: null,
        expense_date: null,
        payment_date: null,
        accounting_year: null,
        semester: null,
        explanation: null,
        amount: 0,
        party_owed: null,
      },
    };
  },
  created() {
    this.expense.accounting_year = new Date().getFullYear();
    let today = new Date().toISOString().substring(0, 10);
    this.expense.expense_date = today;
    this.paymentDate = today;
    this.expense.reported_by = this.$store.state.id;
    axios
      .get(API_URL + "read_current_semester.php")
      .then((response) => {
        this.expense.semester = response.data;
        this.loadLineItems();
      })
      .catch((error) => {
        this.$root.$children[0].showError(error.response.statusText);
      });
  },
  methods: {
    loadLineItems() {
      if (this.$store.state.authTier < AUTH_TIERS.OFFICER) {
        this.lineItems = this.$store.state.committees;
      } else {
        axios
          .get(API_URL + "read_line_items.php", {
            headers: { Authorization: this.$store.state.jwt },
          })
          .then((response) => {
            this.lineItems = response.data.body;
            this.loaded = true;
          })
          .catch((error) => {
            this.$root.$children[0].showError(error.response.statusText);
          });
      }
    },
    onSubmit() {
      if (this.hasBeenPaid) {
        this.expense.payment_date = this.paymentDate;
      }
      axios
        .post(API_URL + "create_expense.php", this.expense, {
          headers: { Authorization: this.$store.state.jwt },
        })
        .then((response) => {
          this.$root.$children[0].showSuccess(response.data.message);
          this.reset();
        })
        .catch((error) => {
          this.$root.$children[0].showError(error.response.statusText);
        });
    },
    getCustomDescription(option) {
      return option.roll_number + " " + option.full_name;
    },
    reset() {
      this.$emit("doReset");
      this.expense.payment_date = null;
      this.hasBeenPaid = false;
      this.expense.line_item = null;
      this.expense.amount = 0;
      this.expense.reason = null;
      this.expense.explanation = null;
      this.expense.party_owed = null;
    },
  },
};
</script>

<style scoped>
h2 {
  margin-bottom: 20px;
}
.row {
  margin: 0;
}
#payment-date {
  padding: 20px;
  border-radius: 10px;
  background-color: var(--ot-off-white);
  margin-bottom: 10px;
}
#payment-datepicker {
  margin-top: 10px;
  margin-bottom: 0px;
}
#semester,
#year {
  margin-right: 10px;
  max-width: 88px;
}
h5 {
  margin-top: 30px;
  margin-bottom: 20px;
  text-align: center;
}
button {
  max-height: 38px;
  margin-top: 31px;
}
</style>
