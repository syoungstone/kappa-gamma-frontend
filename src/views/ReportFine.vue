<template>
  <div class="narrow-wrapper">
    <h1>Report Fine</h1>
    <b-form v-if="loaded" @submit.prevent="onSubmit">
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
          v-model="fine.fine_date"
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
            v-model="fine.amount"
            required
          ></b-form-input>
        </b-input-group>
      </b-form-group>

      <b-form-group label="Reason:">
        <b-form-textarea
          id="textarea"
          v-model="fine.reason"
          placeholder="Please describe the reason for the fine..."
          required
        ></b-form-textarea>
      </b-form-group>

      <b-button
        class="submit-button"
        type="submit"
        variant="primary"
        :disabled="fine.amount <= 0"
        >Submit</b-button
      >
    </b-form>
  </div>
</template>

<script>
import axios from "axios";
import { AUTH_TIERS, API_URL } from "../constants/index.js";
export default {
  name: "StudentForm",
  props: ["eventData"],
  data() {
    return {
      AUTH_TIERS: AUTH_TIERS,
      loaded: false,
      brothers: null,
      brother: null,
      fine: {
        brother: null,
        amount: 0,
        fine_date: null,
        reason: null,
      },
    };
  },
  created() {
    this.fine.fine_date = new Date().toISOString().substring(0, 10);
    this.loadBrothers();
  },
  methods: {
    loadBrothers() {
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
    onSubmit() {
      this.fine.brother = this.brother.id;
      axios
        .post(API_URL + "create_fine.php", this.fine, {
          headers: { Authorization: this.$store.state.jwt },
        })
        .then((response) => {
          this.$root.$children[0].showSuccess(response.data.message);
          this.$router.push("/dashboard", () => {});
        })
        .catch((error) => {
          this.$root.$children[0].showError(error.response.statusText);
        });
    },
    getCustomDescription(option) {
      return option.roll_number + " " + option.full_name;
    },
  },
};
</script>

<style scoped>
h1 {
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
