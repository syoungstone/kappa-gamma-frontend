<template>
  <div id="everything">
    <h1>Your User Profile</h1>
    <div v-if="error" class="mt-3">
      <strong>{{ error }}</strong>
    </div>
    <b-form @submit="onSubmit" v-if="loaded">
      <b-form-group
        id="input-group-1"
        label="Phone Number:"
        label-for="input-1"
        :invalid-feedback="invalidFeedback1"
        :state="state1"
      >
        <b-form-input
          id="input-1"
          v-model="data.phone_number"
          type="tel"
          :state="state1"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="Major:" label-for="input-2">
        <b-form-input id="input-2" v-model="data.major" required></b-form-input>
      </b-form-group>

      <b-form-group
        id="input-group-3"
        label="Graduation Year:"
        label-for="input-3"
        :invalid-feedback="invalidFeedback2"
        :state="state2"
      >
        <b-form-input
          id="input-3"
          v-model="data.grad_year"
          type="number"
          :state="state2"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-4" label="Hometown:" label-for="input-4">
        <b-form-input
          id="input-4"
          v-model="data.hometown"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group
        id="input-group-5"
        label="Home State:"
        label-for="input-5"
        :invalid-feedback="invalidFeedback3"
        :state="state3"
      >
        <b-form-input
          id="input-5"
          v-model="data.home_state"
          :state="state3"
        ></b-form-input>
      </b-form-group>

      <b-form-group
        id="input-group-6"
        label="Home Country:"
        label-for="input-6"
      >
        <b-form-input id="input-6" v-model="data.home_country"></b-form-input>
      </b-form-group>

      <b-button type="submit" variant="primary">Save</b-button>
      <p v-if="response">{{ response }}</p>
      <p v-if="error">An error occurred.</p>
    </b-form>
    <h3 v-else>Loading...</h3>
  </div>
</template>

<script>
import axios from "axios";
export default {
  computed: {
    state1() {
      const regex = new RegExp("[0-9]{10}");
      return (
        regex.test(this.data.phone_number) &&
        this.data.phone_number.length == 10
      );
    },
    state2() {
      return this.data.grad_year >= 1998 && this.data.grad_year < 2100;
    },
    state3() {
      const regex = new RegExp("[A-Z]{2}");
      return (
        (regex.test(this.data.home_state) &&
          this.data.home_state.length == 2) ||
        this.data.home_state.length == 0
      );
    },
    invalidFeedback1() {
      return "Phone number must be exactly 10 digits.";
    },
    invalidFeedback2() {
      return "Not a valid graduation year.";
    },
    invalidFeedback3() {
      return "State must be represented by two uppercase letters, e.g. 'VA'.";
    },
  },
  created() {
    axios
      .get(process.env.VUE_APP_API + "read_current_student.php", {
        headers: { Authorization: this.$store.state.jwt },
      })
      .then((response) => {
        this.data = response.data;
        this.loaded = true;
      })
      .catch((error) => (this.error = error));
  },
  data() {
    return {
      selected: null,
      data: {
        phone_number: "",
        grad_year: "",
        major: "",
        hometown: "",
        home_state: "",
        home_country: "",
      },
      response: null,
      error: null,
      loaded: false,
    };
  },
  methods: {
    onSubmit() {
      axios
        .post(
          process.env.VUE_APP_API + "update_current_student.php",
          this.data,
          {
            headers: { Authorization: this.$store.state.jwt },
          }
        )
        .then((response) => {
          this.response = response.data;
        })
        .catch((error) => (this.error = error));
    },
  },
};
</script>
