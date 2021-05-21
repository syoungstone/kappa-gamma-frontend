<template>
  <div class="narrow-wrapper">
    <h1>Reset Password</h1>
    <b-form @submit.prevent="onSubmit">
      <p>
        Enter your email and we will send you a link to reset your password.
      </p>
      <b-form-group id="input-group-1">
        <b-form-input
          id="input-1"
          v-model="form.email"
          type="email"
          placeholder="Enter email"
          required
        ></b-form-input>
      </b-form-group>

      <b-button type="submit" variant="primary">Submit</b-button>
    </b-form>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      form: {
        email: "",
      },
      loading: false,
      error: null,
    };
  },
  methods: {
    onSubmit() {
      axios
        .post(
          this.$store.state.apiURL + "forgot_password.php",
          JSON.stringify(this.form)
        )
        .then((response) => {
          this.$root.$children[0].showSuccess(response.data.message);
        })
        .catch((error) => {
          this.error = error;
          this.$root.$children[0].showError(
            "There is no account currently associated with your email address. Please register an account."
          );
        });
    },
  },
};
</script>
