<template>
  <b-input-group id="input-2">
    <b-form-select
      id="is-engineering-select"
      :options="majorOptions"
      v-model="isEngineeringMajor"
    ></b-form-select>
    <b-form-select
      v-if="isEngineeringMajor"
      :options="engineeringMajorsList"
      v-model="majorReturned"
      @change="updateMajor()"
      required
    ></b-form-select>
    <b-input
      v-else
      v-model="majorReturned"
      @input="updateMajor()"
      required
    ></b-input>
    <b-input-group-append v-if="showDelete">
      <b-button variant="danger" @click="deleteMajor()"> Delete </b-button>
    </b-input-group-append>
  </b-input-group>
</template>

<script>
export default {
  name: "MajorSelect",
  props: {
    major: {
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    showDelete: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      isEngineeringMajor: null,
      majorReturned: null,
      majorOptions: [
        { value: true, text: "Engineering" },
        { value: false, text: "Other" },
      ],
      engineeringMajorsList: [
        "Biomedical Engineering",
        "Chemical and Life Science Engineering",
        "Computer Engineering",
        "Computer Science",
        "Electrical Engineering",
        "Mechanical Engineering",
      ],
    };
  },
  created() {
    this.isEngineeringMajor =
      this.major == null || this.engineeringMajorsList.includes(this.major);
    this.majorReturned = this.major;
  },
  methods: {
    deleteMajor() {
      this.$emit("delete-major", this.index);
    },
    updateMajor() {
      this.$emit("update-major", this.index, this.majorReturned);
    },
  },
};
</script>

<style scoped>
#is-engineering-select {
  max-width: 30%;
  background-color: var(--ot-off-white);
}
#input-2 {
  margin-bottom: 15px;
}
</style>
