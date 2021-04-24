<template>
  <div class="about" id="everything">
    <h1>This is an about page</h1>
    <h2>This is an API test</h2>
    <p>Enter the id of the student you wish to view</p>
    <b-form-select v-model="selected" :options="options"></b-form-select>
    <div v-if="results" class="mt-3">
      Results: <strong>{{ results }}</strong>
    </div>
    <div v-if="error" class="mt-3">
      Results: <strong>{{ error }}</strong>
    </div>
    <b-button @click="onSubmit" variant="primary">Submit</b-button>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      selected: null,
      results: null,
      error: null,
      options: [
        { value: 1, text: "Student 1" },
        { value: 2, text: "Student 2" },
        { value: 3, text: "Student 3" },
        { value: 4, text: "Student 4" },
        { value: 5, text: "Student 5" },
        { value: 5, text: "Student 6" },
      ],
    };
  },
  methods: {
    onSubmit() {
      axios
        .get(process.env.VUE_APP_API + "read_student.php?id=" + this.selected, {
          headers: { Authorization: this.$store.state.jwt },
        })
        .then((response) => (this.results = response.data))
        .catch((error) => (this.error = error));
    },
  },
};
</script>
