<template>
  <div class="narrow-wrapper">
    <h1>{{ $route.name }}</h1>
    <b-form @submit.prevent="onSubmit">
      <p>Only current pledges and brothers may register for an account.</p>
      <p>Email must match the information we have on file for you.</p>
      <p>
        If you would like to use a different email than the one we have on file,
        please contact your Regent or Pledge Instructor.
      </p>
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
      <p v-if="error">
        Account creation failed. Check if the email you are using is available.
      </p>
      <p v-if="loginError">
        We're having trouble logging you in. Please try again later.
      </p>
    </b-form>
  </div>
</template>

<script>
import axios from "axios";
export default {
  computed: {
    submitDisabled() {
      return !this.state1 || !this.state2;
    },
  },
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
      password_confirm: "",
      response: "",
      error: "",
      loginError: "",
      state1: null,
      state2: null,
    };
  },
  methods: {
    onSubmit() {
      axios
        .post(
          this.$store.state.apiURL + "create_user.php",
          JSON.stringify(this.form)
        )
        .then((response) => {
          this.response = response.data;
          this.$store.commit("setUser", this.form.email);
          this.$store.commit("setId", this.response.id);
          this.$store.commit("setJwt", this.response.jwt);
          this.$store.commit("setName", this.response.name_last);
          this.$store.commit("setBrother", this.response.is_brother);
          this.$store.commit("setOfficer", this.response.is_officer);
          this.$store.commit("login");
          this.$router.push("/dashboard", () => {});
        })
        .catch((error) => {
          this.error = error;
        });
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
