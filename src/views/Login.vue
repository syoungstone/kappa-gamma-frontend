<template>
  <div class="narrow-wrapper">
    <h1>Log In</h1>
    <b-form @submit.prevent="onSubmit">
      <b-form-group id="input-group-1" label="Email:" label-for="input-1">
        <b-form-input
          id="input-1"
          v-model="form.email"
          type="email"
          placeholder="Enter email"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="Password:" label-for="input-2">
        <b-form-input
          id="input-2"
          v-model="form.password"
          type="password"
          placeholder="Enter password"
          required
        ></b-form-input>
      </b-form-group>

      <b-button type="submit" variant="primary">Submit</b-button>
      <b-link id="forgot-link" @click="forgotPassword()"
        >Forgot Password</b-link
      >
    </b-form>
  </div>
</template>

<script>
import axios from "axios";
import { AUTH_TIERS, API_URL } from "../constants/index.js";
export default {
  data() {
    return {
      AUTH_TIERS: AUTH_TIERS,
      form: {
        email: "",
        password: "",
      },
      loading: false,
    };
  },
  methods: {
    onSubmit() {
      axios
        .post(API_URL + "login.php", JSON.stringify(this.form))
        .then((response) => {
          this.$store.commit("setUser", response.data.jwt);
          let redirect = this.$route.params.redirect;
          let path = "/" + (redirect ? redirect : "dashboard");
          this.$router.push(path, () => {});
        })
        .catch((error) =>
          this.$root.$children[0].showError(error.response.statusText)
        );
    },
    forgotPassword() {
      this.$router.push("/forgotpassword", () => {});
    },
  },
};
</script>

<style scoped>
#forgot-link {
  margin-left: 15px;
}
</style>
