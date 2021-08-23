<template>
  <div class="narrow">
    <h2>Report Income</h2>
    <h5 v-if="$store.state.authTier >= AUTH_TIERS.FINANCIAL">
      This form is <strong>not</strong> for recording dues payments. That can be
      done <router-link to="/duesandfines">here</router-link>.
    </h5>
    <b-form v-if="loaded" @submit.prevent="onSubmit">
      <b-form-group label="Name:">
        <b-input v-model="income.reason" required></b-input>
      </b-form-group>

      <b-form-group label="Amount:">
        <b-input-group prepend="$">
          <b-form-input
            type="number"
            step="0.01"
            min="0"
            v-model="income.amount"
            required
          ></b-form-input>
        </b-input-group>
      </b-form-group>

      <b-form-group label="Line item:">
        <b-form-select
          v-model="income.line_item"
          :options="lineItems"
          value-field="line_item_id"
          text-field="line_item_name"
          required
        ></b-form-select>
      </b-form-group>

      <b-form-group label="Date income received:">
        <b-form-datepicker
          v-model="income.payment_date"
          :date-format-options="{
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
          }"
          required
        >
        </b-form-datepicker>
      </b-form-group>

      <b-form-group label="Description (optional):">
        <b-form-textarea
          v-model="income.explanation"
          placeholder="Please provide any necessary context..."
        ></b-form-textarea>
      </b-form-group>

      <h5>Please select which semester's budget to apply this income to:</h5>
      <div class="row justify-content-center">
        <b-form-group id="semester" label="Semester:">
          <b-form-select
            :options="[
              { text: 'Fall', value: 'F' },
              { text: 'Spring', value: 'S' },
            ]"
            v-model="income.semester"
            required
          ></b-form-select>
        </b-form-group>
        <b-form-group id="year" label="Year:">
          <b-form-input
            id="year-select"
            type="number"
            v-model="income.accounting_year"
            required
          ></b-form-input>
        </b-form-group>
        <b-button
          class="submit-button"
          type="submit"
          variant="primary"
          :disabled="income.amount <= 0"
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
      lineItems: null,
      income: {
        reason: null,
        reported_by: null,
        line_item: null,
        payment_date: null,
        accounting_year: null,
        semester: null,
        explanation: null,
        amount: 0,
      },
    };
  },
  created() {
    this.income.accounting_year = new Date().getFullYear();
    this.income.payment_date = new Date().toISOString().substring(0, 10);
    this.income.reported_by = this.$store.state.id;
    axios
      .get(API_URL + "read_current_semester.php")
      .then((response) => {
        this.income.semester = response.data;
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
      axios
        .post(API_URL + "create_income.php", this.income, {
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
      this.income.line_item = null;
      this.income.amount = 0;
      this.income.reason = null;
      this.income.explanation = null;
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
