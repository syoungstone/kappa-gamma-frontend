<template>
  <div id="narrow-wrapper">
    <h1>{{ $route.name }}</h1>
    <LoadingSpinner v-if="loading" />
    <b-form v-else @submit="onSubmit">
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

      <p v-if="response">{{ response.message }}</p>
      <p v-if="error">
        Login failed. Please make sure you are using the correct email and
        password.
      </p>
    </b-form>
  </div>
</template>

<script>
import axios from "axios";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
export default {
  components: {
    LoadingSpinner,
  },
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
      loading: false,
      response: null,
      error: null,
    };
  },
  methods: {
    onSubmit() {
      this.loading = true;
      axios
        .post(this.$store.state.apiURL + "login.php", JSON.stringify(this.form))
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
          this.loading = false;
        });
    },
  },
};
</script>

<style>
#narrow-wrapper {
  max-width: 500px;
  max-height: 500px;
  padding: 20px;
  margin: 100px auto;
}
</style>
