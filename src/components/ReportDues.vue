<template>
  <b-form @submit.prevent="onSubmit">
    <b-form-group label="Brother:">
      <vue-single-select
        inputId="input-x"
        v-model="brother"
        :options="brothers"
        optionKey="id"
        optionLabel="full_name"
        required
        :getOptionDescription="getCustomDescription"
      ></vue-single-select>
    </b-form-group>

    <b-form-group label="Date:">
      <b-form-datepicker
        v-model="dues.assessed_date"
        :date-format-options="{
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        }"
        required
      >
      </b-form-datepicker>
    </b-form-group>

    <b-form-group label="Amount:">
      <b-input-group prepend="$">
        <b-form-input
          type="number"
          step="0.01"
          min="0"
          v-model="dues.amount"
          required
        ></b-form-input>
      </b-input-group>
    </b-form-group>

    <h5>Please select which semester these dues apply to:</h5>
    <div class="row justify-content-center">
      <b-form-group id="semester" label="Semester:">
        <b-form-select
          :options="[
            { text: 'Fall', value: 'F' },
            { text: 'Spring', value: 'S' },
          ]"
          v-model="dues.semester"
          required
        ></b-form-select>
      </b-form-group>
      <b-form-group id="year" label="Year:">
        <b-form-input
          id="year-select"
          type="number"
          v-model="dues.accounting_year"
          required
        ></b-form-input>
      </b-form-group>
      <b-button
        class="submit-button"
        type="submit"
        variant="primary"
        :disabled="dues.amount <= 0"
        >Submit</b-button
      >
    </div>
  </b-form>
</template>

<script>
import axios from "axios";
import { AUTH_TIERS, API_URL } from "../constants/index.js";
export default {
  name: "ReportDues",
  props: {
    semester: {
      required: true,
    },
  },
  data() {
    return {
      AUTH_TIERS: AUTH_TIERS,
      loaded: false,
      brothers: null,
      brother: null,
      dues: {
        brother: null,
        amount: 250,
        assessed_date: null,
        accounting_year: null,
        semester: null,
      },
    };
  },
  created() {
    this.dues.semester = this.semester;
    this.dues.accounting_year = new Date().getFullYear();
    this.dues.assessed_date = new Date().toISOString().substring(0, 10);
    axios
      .get(API_URL + "read_brother_names.php", {
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
  methods: {
    onSubmit() {
      this.dues.brother = this.brother.id;
      axios
        .post(API_URL + "create_dues.php", this.dues, {
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
      this.brother = null;
      this.dues.brother = null;
      this.dues.amount = 250;
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
