<template>
  <div id="everything">
    <h1>{{ $route.name }}</h1>
    <p>Only current pledges and brothers may register for an account.</p>
    <p>
      First name, last name, and email must match the information we have on
      file for you.
    </p>
    <p>
      If you would like to use a different email than the one we have on file,
      please contact your Regent or Pledge Instructor.
    </p>

    <b-form @submit="onSubmit">
      <b-form-group id="input-group-1" label="First name:" label-for="input-1">
        <b-form-input
          id="input-1"
          v-model="form.first_name"
          placeholder="Enter name"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="Last name:" label-for="input-2">
        <b-form-input
          id="input-2"
          v-model="form.last_name"
          placeholder="Enter name"
          required
        ></b-form-input>
      </b-form-group>

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
        :invalid-feedback="invalidFeedback1"
        :state="state1"
      >
        <b-form-input
          id="input-4"
          v-model="form.password"
          type="password"
          placeholder="Enter password"
          :state="state1"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group
        id="input-group-5"
        label="Confirm Password:"
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
    </b-form>
  </div>
</template>

<script>
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
        first_name: "",
        last_name: "",
        email: "",
        password: "",
      },
      password_confirm: "",
    };
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();
      alert(JSON.stringify(this.form));
    },
  },
};
</script>

<style>
#everything {
  max-width: 500px;
  max-height: 500px;
  padding: 20px;
  margin: 100px auto;
}
</style>
