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
      <b-form-group
        id="input-group-1"
        label="Phone Number:"
        label-for="input-1"
        invalid-feedback="Phone number must be exactly 10 digits."
        :state="state1"
      >
        <b-form-input
          id="input-1"
          v-model="data.phone_number"
          type="tel"
          :state="state1"
          required
          @change="updateState1()"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="Major:" label-for="input-2">
        <b-form-input id="input-2" v-model="data.major" required></b-form-input>
      </b-form-group>

      <b-form-group
        id="input-group-3"
        label="Graduation Year:"
        label-for="input-3"
        invalid-feedback="Not a valid graduation year."
        :state="state2"
      >
        <b-form-input
          id="input-3"
          v-model="data.grad_year"
          type="number"
          :state="state2"
          required
          @change="updateState2()"
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
        invalid-feedback="State must be represented by two uppercase letters, e.g. 'VA'."
        :state="state3"
      >
        <b-form-input
          id="input-5"
          v-model="data.home_state"
          :state="state3"
          @change="updateState3()"
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
    submitDisabled() {
      return !(
        (this.state1 || this.state1 == null) &&
        (this.state2 || this.state2 == null) &&
        (this.state3 || this.state3 == null)
      );
    },
  },
  created() {
    axios
      .get(process.env.VUE_APP_API + "read_current_student.php", {
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
      data: {
        name_first: "",
        name_middle: "",
        name_last: "",
        phone_number: "",
        grad_year: "",
        major: "",
        hometown: "",
        home_state: "",
        home_country: "",
      },
      response: null,
      error: null,
      loaded: false,
      state1: null,
      state2: null,
      state3: null,
    };
  },
  methods: {
    onSubmit() {
      axios
        .post(
          process.env.VUE_APP_API + "update_current_student.php",
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
    updateState1() {
      const regex = new RegExp("[0-9]{10}");
      this.state1 =
        regex.test(this.data.phone_number) &&
        this.data.phone_number.length == 10;
    },
    updateState2() {
      this.state2 = this.data.grad_year >= 1998 && this.data.grad_year < 2100;
    },
    updateState3() {
      const regex = new RegExp("[A-Z]{2}");
      this.state3 =
        (regex.test(this.data.home_state) &&
          this.data.home_state.length == 2) ||
        this.data.home_state.length == 0;
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
