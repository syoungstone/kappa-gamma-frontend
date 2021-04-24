<template>
  <div id="everything">
    <h1>{{ $route.name }}</h1>

    <p>Edit Password</p>
    <b-form @submit="onSubmit">
      <b-form-group
        id="input-group-4"
        label="Password:"
        label-for="input-4"
        :invalid-feedback="invalidFeedback1"
        :state="state1"
      >
        <b-form-input
          id="input-4"
          v-model="form.password"
          type="password"
          placeholder="New password"
          :state="state1"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group
        id="input-group-5"
        label="Confirm password:"
        label-for="input-5"
        :invalid-feedback="invalidFeedback2"
        :state="state2"
      >
        <b-form-input
          id="input-5"
          v-model="password_confirm"
          type="password"
          placeholder="Enter password"
          :state="state2"
          required
        ></b-form-input>
      </b-form-group>
      <b-button type="submit" variant="primary">Submit</b-button>
      <p v-if="response">{{ response.message }}</p>
      <p v-if="error">Attempt to change password failed.</p>
    </b-form>
    <div v-if="deletePressed" class="delete">
      <p>Are you sure?</p>
      <b-button class="delete-button" @click="deleteAccount" variant="primary"
        >Yes, Delete My Account</b-button
      >
    </div>
    <b-button
      v-else
      class="delete delete-button"
      @click="deleteButton"
      variant="primary"
      >Delete Account</b-button
    >
    <p v-if="deleteResponse">{{ response }}</p>
    <p v-if="deleteError">Attempt to delete account failed.</p>
  </div>
</template>

<script>
import axios from "axios";
export default {
  computed: {
    state1() {
      return this.form.password.length >= 8;
    },
    state2() {
      return (
        this.form.password.length >= 8 &&
        this.form.password == this.password_confirm
      );
    },
    invalidFeedback1() {
      if (this.form.password.length > 0) {
        return "Password must be at least 8 characters long.";
      }
      return "";
    },
    invalidFeedback2() {
      if (
        this.form.password.length > 0 &&
        this.form.password != this.password_confirm
      ) {
        return "Passwords don't match.";
      }
      return "";
    },
  },
  data() {
    return {
      form: {
        email: this.$store.state.user,
        password: "",
        jwt: this.$store.state.jwt,
      },
      deletePressed: false,
      password_confirm: "",
      response: "",
      error: "",
      deleteResponse: "",
      deleteError: "",
    };
  },
  methods: {
    onSubmit() {
      axios
        .post(
          process.env.VUE_APP_API + "update_user.php",
          JSON.stringify(this.form)
        )
        .then((response) => {
          this.response = response.data;
          this.$store.commit("setJwt", this.response.jwt);
        })
        .catch((error) => (this.error = error));
    },
    deleteButton() {
      this.deletePressed = true;
    },
    deleteAccount() {
      axios
        .delete(process.env.VUE_APP_API + "delete_user.php", {
          headers: { Authorization: this.$store.state.jwt },
        })
        .then((response) => {
          this.deleteResponse = response;
          this.$store.commit("logout");
          this.$router.push("/", () => {});
        })
        .catch((error) => (this.deleteError = error));
    },
  },
};
</script>

<style>
.delete {
  margin-top: 50px;
}
.delete-button {
  background-color: dimgray;
}
</style>
