<template>
  <div class="narrow-wrapper">
    <h1>{{ $route.name }}</h1>
    <b-form @submit.prevent="onSubmit">
      <b-form-group
        id="input-group-4"
        label-for="input-4"
        invalid-feedback="Password must be at least 8 characters long."
        :state="state1"
      >
        <b-form-input
          id="input-4"
          v-model="form.password"
          type="password"
          placeholder="New password"
          :state="state1"
          required
          @input="updateState1()"
        ></b-form-input>
      </b-form-group>

      <b-form-group
        id="input-group-5"
        label-for="input-5"
        invalid-feedback="Passwords don't match."
        :state="state2"
      >
        <b-form-input
          id="input-5"
          v-model="password_confirm"
          type="password"
          placeholder="Confirm password"
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
export default {
  computed: {
    submitDisabled() {
      return !this.state1 || !this.state2;
    },
  },
  data() {
    return {
      form: {
        id: null,
        verify_hash: null,
        password: null,
      },
      password_confirm: "",
      state1: null,
      state2: null,
    };
  },
  methods: {
    onSubmit() {
      this.form.id = this.$route.params.id;
      this.form.verify_hash = this.$route.params.verify_hash;
      axios
        .post(this.$apiUrl + "reset_password.php", JSON.stringify(this.form))
        .then((response) => {
          this.$root.$children[0].showSuccess(response.data.message);
          this.$router.push("/login", () => {});
        })
        .catch((error) => {
          this.$root.$children[0].showError(error.response.statusText);
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

<style scoped>
h4 {
  margin-top: 30px;
  text-align: left;
}
</style>
