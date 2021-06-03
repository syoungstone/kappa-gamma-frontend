<template>
  <div class="narrow-wrapper">
    <h1>{{ $route.name }}</h1>
    <b-form @submit.prevent="onSubmit">
      <div id="text">
        <p>Only current pledges and brothers may register for an account.</p>
        <p>Your email must match the information we have on file for you.</p>
        <p>
          If you are unable to create an account with the email you wish to use,
          please contact your Regent or Pledge Instructor.
        </p>
      </div>
      <b-form-group id="input-group-3" label="Email:" label-for="input-3">
        <b-form-input
          id="input-3"
          v-model="form.email"
          type="email"
          placeholder="Enter email"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group
        id="input-group-4"
        label="Password:"
        label-for="input-4"
        invalid-feedback="Password must be at least 8 characters long."
        :state="state1"
      >
        <b-form-input
          id="input-4"
          v-model="form.password"
          type="password"
          placeholder="Enter password"
          :state="state1"
          required
          @input="updateState1()"
        ></b-form-input>
      </b-form-group>

      <b-form-group
        id="input-group-5"
        label="Confirm password:"
        label-for="input-5"
        invalid-feedback="Passwords don't match."
        :state="state2"
      >
        <b-form-input
          id="input-5"
          v-model="password_confirm"
          type="password"
          placeholder="Enter password"
          :state="state2"
          required
          @input="updateState2()"
        ></b-form-input>
      </b-form-group>
      <b-button type="submit" variant="primary" :disabled="submitDisabled"
        >Submit</b-button
      >
    </b-form>
  </div>
</template>

<script>
import axios from "axios";
import { AUTH_TIERS, API_URL } from "../constants/index.js";
export default {
  computed: {
    submitDisabled() {
      return !this.state1 || !this.state2;
    },
  },
  data() {
    return {
      AUTH_TIERS: AUTH_TIERS,
      form: {
        email: "",
        password: "",
      },
      password_confirm: "",
      state1: null,
      state2: null,
    };
  },
  methods: {
    onSubmit() {
      axios
        .post(API_URL + "create_user.php", JSON.stringify(this.form))
        .then((response) => {
          this.$root.$children[0].showSuccess(response.data.message);
        })
        .catch((error) =>
          this.$root.$children[0].showError(error.response.statusText)
        );
    },
    updateState1() {
      this.state1 = this.form.password.length >= 8;
      this.updateState2();
    },
    updateState2() {
      this.state2 = this.form.password == this.password_confirm;
    },
  },
};
</script>

<style scoped>
h1 {
  margin-bottom: 20px;
}
#text {
  margin-bottom: 30px;
}
</style>
