<template>
  <div id="everything">
    <b-form @submit="onSubmit" v-if="loaded">
      <div v-if="data.photo" class="thumbnail">
        <img :src="data.photo" alt="Profile photo" />
      </div>
      <div v-else class="thumbnail">
        <img src="../assets/nophoto.jpg" alt="Photo placeholder" />
      </div>
      <h1>
        {{ data.name_first + " " }}
        {{ data.name_middle ? data.name_middle + " " : "" }}
        {{ data.name_last }}
      </h1>

      <b-form-group id="select-group-0" label="Status:" label-for="select-0">
        <b-form-select
          id="select-0"
          v-model="data.brother_status"
          :options="statusOptions"
          required
        ></b-form-select>
      </b-form-group>

      <b-form-group id="select-group-1" label="Standing:" label-for="select-1">
        <b-form-select
          id="select-1"
          v-model="data.good_standing"
          :options="standingOptions"
          required
        ></b-form-select>
      </b-form-group>

      <b-form-group id="input-group-0" label="Roll Number:" label-for="input-0">
        <b-form-input
          id="input-0"
          v-model="data.roll_number"
          type="number"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-a" label="First Name:" label-for="input-a">
        <b-form-input
          id="input-a"
          v-model="data.name_first"
          type="tel"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-b" label="Middle Name:" label-for="input-b">
        <b-form-input id="input-b" v-model="data.name_middle"></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-c" label="Last Name:" label-for="input-c">
        <b-form-input
          id="input-c"
          v-model="data.name_last"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-d" label="Nickname:" label-for="input-d">
        <b-form-input id="input-d" v-model="data.nickname"></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-e" label="Email:" label-for="input-e">
        <b-form-input
          id="input-e"
          v-model="data.email"
          type="email"
          required
        ></b-form-input>
      </b-form-group>

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

      <b-button type="submit" variant="primary" :disabled="submitDisabled"
        >Save</b-button
      >
    </b-form>
    <h3 v-else>Loading...</h3>
    <div v-if="error" class="mt-3">
      <strong>{{ error }}</strong>
    </div>
    <div v-if="response" class="mt-3">
      <strong>{{ response }}</strong>
    </div>
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
    submitDisabled() {
      return !this.state1 || !this.state2 || !this.state3;
    },
  },
  created() {
    this.id = this.$route.params.id;
    axios
      .get(process.env.VUE_APP_API + "read_brother.php?id=" + this.id, {
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
      data: {},
      statusOptions: [
        { value: "active", text: "Active" },
        { value: "inactive", text: "Inactive" },
        { value: "early alum", text: "Early alum" },
        { value: "alumni", text: "Alumni" },
      ],
      standingOptions: [
        { value: 1, text: "In Good Standing" },
        { value: 0, text: "Not In Good Standing" },
      ],
      response: null,
      error: null,
      loaded: false,
    };
  },
  methods: {
    onSubmit() {
      axios
        .post(
          process.env.VUE_APP_API + "update_brother.php?id=" + this.data.id,
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

<style>
.thumbnail {
  margin: auto;
  position: relative;
  width: 200px;
  height: 200px;
  overflow: hidden;
  border: 3px solid black;
}
.thumbnail img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}
.thumbnail img.portrait {
  width: 100%;
  height: auto;
}
</style>
