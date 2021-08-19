<template>
  <div>
    <div v-if="loaded">
      <h1>
        {{ ($store.state.id == id ? "My" : studentName) + " Attendance" }}
      </h1>
      <b-table
        :items="attendance"
        :fields="fields"
        striped
        show-empty
        responsive="sm"
      >
        <template #cell(us_date)="row">
          {{
            row.item.start.substring(5, 7) +
            "/" +
            row.item.start.substring(8, 10) +
            "/" +
            row.item.start.substring(2, 4)
          }}
        </template>
        <template #cell(title)="row">
          <router-link :to="'/event/' + row.item.id">{{
            row.item.title
          }}</router-link>
        </template>
        <template #cell(present)="row">
          {{ row.item.in_attendance == 1 ? "Yes" : "No" }}
        </template>
        <template #cell(excused)="row">
          {{
            row.item.excused == null
              ? "N/A"
              : row.item.excused == 1
              ? "Yes"
              : "No"
          }}
        </template>
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
  name: "AttendanceDisplay",
  props: {
    id: {
      required: true,
    },
  },
  components: {
    LoadingSpinner,
  },
  created() {
    if (this.$store.state.id == this.id) {
      this.loadEntries();
    } else {
      this.loadName();
    }
  },
  data() {
    return {
      fields: [
        { key: "us_date", label: "Date" },
        { key: "title" },
        { key: "present" },
        { key: "excused" },
      ],
      AUTH_TIERS: AUTH_TIERS,
      balance_owed: 0,
      attendance: null,
      loaded: false,
    };
  },
  methods: {
    loadName() {
      axios
        .get(API_URL + "read_student.php?id=" + this.id, {
          headers: { Authorization: this.$store.state.jwt },
        })
        .then((response) => {
          let student = response.data;
          this.studentName = student.name_first + " " + student.name_last;
          if (this.studentName.slice(-1) == "s") {
            this.studentName = this.studentName + "'";
          } else {
            this.studentName = this.studentName + "'s";
          }
          this.loadEntries();
        })
        .catch((error) => {
          this.$root.$children[0].showError(error.response.statusText);
        });
    },
    loadEntries() {
      axios
        .get(API_URL + "read_attendance.php?brother=" + this.id, {
          headers: { Authorization: this.$store.state.jwt },
        })
        .then((response) => {
          this.attendance = response.data.body;
          this.loaded = true;
        })
        .catch((error) => {
          this.loaded = true;
          this.$root.$children[0].showError(error.response.statusText);
        });
    },
  },
};
</script>

<style scoped>
h1 {
  margin-bottom: 20px;
}
</style>
