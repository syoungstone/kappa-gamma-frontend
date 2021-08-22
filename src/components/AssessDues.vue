<template>
  <div>
    <h2>Assess Dues</h2>
    <div v-if="loaded">
      <b-form @submit.prevent="onSubmit">
        <div class="row justify-content-center">
          <b-form-group label="Early alum dues:">
            <b-input-group prepend="$">
              <b-form-input
                type="number"
                step="0.01"
                min="0"
                v-model="dues.early_alum_amount"
                required
              ></b-form-input>
            </b-input-group>
          </b-form-group>
          <b-form-group label="Active dues:">
            <b-input-group prepend="$">
              <b-form-input
                type="number"
                step="0.01"
                min="0"
                v-model="dues.active_member_amount"
                required
              ></b-form-input>
            </b-input-group>
          </b-form-group>
          <b-form-group label="New member dues:">
            <b-input-group prepend="$">
              <b-form-input
                type="number"
                step="0.01"
                min="0"
                v-model="dues.new_member_amount"
                required
              ></b-form-input>
            </b-input-group>
          </b-form-group>
        </div>
        <div class="row justify-content-center">
          <b-form-group label="Semester:">
            <b-form-select
              :options="[
                { text: 'Fall', value: 'F' },
                { text: 'Spring', value: 'S' },
              ]"
              v-model="dues.semester"
              required
            ></b-form-select>
          </b-form-group>
          <b-form-group label="Year:">
            <b-form-input
              id="year-select"
              type="number"
              v-model="dues.accounting_year"
              required
            ></b-form-input>
          </b-form-group>
          <b-button variant="danger" type="submit">Assess Dues</b-button>
        </div>
        <h5>
          Please verify that the new members, members going early alum, and
          other active members listed below are all accurate before assessing
          dues for this semester.
        </h5>
        <div id="checkbox-confirm" class="row justify-content-center">
          <b-form-checkbox name="checkbox-confirm" required>
            I confirm that all member information is correct
          </b-form-checkbox>
        </div>
      </b-form>
      <h4>Going Early Alum</h4>
      <b-table
        striped
        hover
        :items="earlyAlums"
        :fields="fields"
        stacked="md"
        show-empty
      >
      </b-table>
      <h4>Newly Initiated Members</h4>
      <b-table
        striped
        hover
        :items="newMembers"
        :fields="fields"
        stacked="md"
        show-empty
      >
      </b-table>
      <h4>Other Active Members</h4>
      <b-table
        striped
        hover
        :items="otherActives"
        :fields="fields"
        stacked="md"
        show-empty
      >
      </b-table>
    </div>
    <LoadingSpinner v-else />
  </div>
</template>

<script>
import axios from "axios";
import { AUTH_TIERS, API_URL } from "../constants/index.js";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
export default {
  name: "AssessDues",
  components: {
    LoadingSpinner,
  },
  data() {
    return {
      AUTH_TIERS: AUTH_TIERS,
      loaded: false,
      students: null,
      pledgeClasses: null,
      dues: {
        semester: null,
        accounting_year: null,
        early_alum_amount: 80,
        active_member_amount: 250,
        new_member_amount: 292,
      },
      fields: [
        { key: "roll_number", label: "Roll" },
        { key: "name_last", label: "Last Name" },
        { key: "name_first", label: "First Name" },
      ],
    };
  },
  computed: {
    earlyAlums() {
      return this.students.filter(
        (student) =>
          student.brother_status == "early alum" &&
          student.early_alum_year == this.dues.accounting_year &&
          student.early_alum_semester == this.dues.semester
      );
    },
    newMembers() {
      return this.students.filter(
        (student) =>
          student.brother_status == "active" &&
          student.pledge_class == this.lastPledgeClass
      );
    },
    otherActives() {
      return this.students.filter(
        (student) =>
          student.brother_status == "active" &&
          student.pledge_class != this.lastPledgeClass
      );
    },
    lastPledgeClass() {
      let semester = this.dues.semester == "F" ? "S" : "F";
      let year =
        this.dues.semester == "F"
          ? this.dues.accounting_year
          : this.dues.accounting_year - 1;
      let pledgeClass = this.pledgeClasses.find(
        (x) => x.accounting_year == year && x.semester == semester
      );
      return pledgeClass ? pledgeClass.class_name : null;
    },
  },
  created() {
    this.dues.accounting_year = new Date().getFullYear();
    this.loadData();
  },
  methods: {
    loadData() {
      axios
        .get(API_URL + "read_current_semester.php")
        .then((response) => {
          this.dues.semester = response.data;
          this.loadPledgeClasses();
        })
        .catch((error) => {
          this.$root.$children[0].showError(error.response.statusText);
        });
    },
    loadPledgeClasses() {
      axios
        .get(API_URL + "read_pledge_classes.php", {
          headers: { Authorization: this.$store.state.jwt },
        })
        .then((response) => {
          this.pledgeClasses = response.data.body;
          this.loadStudents();
        })
        .catch((error) => {
          this.$root.$children[0].showError(error.response.statusText);
        });
    },
    loadStudents() {
      axios
        .get(API_URL + "read_students.php", {
          headers: { Authorization: this.$store.state.jwt },
        })
        .then((response) => {
          this.students = response.data.body;
          this.loaded = true;
        })
        .catch((error) => {
          this.$root.$children[0].showError(error.response.statusText);
        });
    },
    onSubmit() {
      axios
        .post(API_URL + "assess_dues.php", this.dues, {
          headers: { Authorization: this.$store.state.jwt },
        })
        .then((response) => {
          this.$root.$children[0].showSuccess(response.data.message);
          this.$emit("doReset");
        })
        .catch((error) => {
          this.$root.$children[0].showError(error.response.statusText);
        });
    },
  },
};
</script>

<style scoped>
h4 {
  margin-top: 20px;
}
.table {
  margin-top: 20px;
  margin-bottom: 40px;
}
h2,
h5 {
  margin-bottom: 30px;
}
#checkbox-confirm {
  margin-bottom: 50px;
}
h5 {
  margin-top: 30px;
  text-align: center;
}
button {
  margin-top: 31px;
  max-height: 38px;
}
.row {
  margin: auto;
}
.form-group {
  max-width: 140px;
  margin-right: 10px;
}
#year-select {
  max-width: 88px;
}
</style>
