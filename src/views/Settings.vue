<template>
  <div class="narrow-wrapper">
    <h1>{{ $route.name }}</h1>

    <h4>Change Password</h4>
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
    <h4>Delete Account</h4>
    <div v-if="deletePressed" class="delete">
      <p>
        Are you sure? You will need to re-register if you want to use the
        brother portal again.
      </p>
      <b-button class="delete-button" @click="deleteAccount"
        >Yes, Delete My Account</b-button
      >
    </div>
    <div v-else>
      <p>Warning: this action is permanent</p>
      <b-button class="delete delete-button" @click="deleteButton"
        >Delete</b-button
      >
    </div>
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
        email: this.$store.state.user,
        password: "",
        jwt: this.$store.state.jwt,
      },
      deletePressed: false,
      password_confirm: "",
      state1: null,
      state2: null,
    };
  },
  methods: {
    onSubmit() {
      axios
        .post(API_URL + "update_user.php", this.form)
        .then((response) => {
          this.$root.$children[0].showSuccess(response.data.message);
        })
        .catch((error) =>
          this.$root.$children[0].showError(error.response.statusText)
        );
    },
    deleteButton() {
      this.deletePressed = true;
    },
    deleteAccount() {
      axios
        .delete(API_URL + "delete_user.php", {
          headers: { Authorization: this.$store.state.jwt },
        })
        .then((response) => {
          this.$root.$children[0].showSuccess(response.data.message);
          this.$store.commit("logout");
          this.$router.push("/", () => {});
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
h4 {
  margin-top: 30px;
  text-align: left;
}
</style>
