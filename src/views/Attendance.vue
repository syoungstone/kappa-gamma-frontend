<template>
  <div class="narrow-wrapper">
    <h1>Attendance Records</h1>
    <div id="select-date">
      <b-form-datepicker
        v-model="data.meeting_date"
        :date-format-options="{
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        }"
        @input="getRecords()"
        required
      ></b-form-datepicker>
    </div>
    <div
      id="records-exist"
      v-if="$store.state.position != null && recordsExist && !editing"
    >
      <div id="records-message">
        <strong>Records already exist for this date.</strong>
      </div>
      <b-button id="edit-button" variant="primary" @click="editing = true"
        >Edit</b-button
      >
    </div>
    <b-table
      v-if="recordsExist || $store.state.position != null"
      striped
      hover
      :items="data.attendance"
      :fields="fields"
      show-empty
    >
      <template #cell(name)="row">
        {{ row.item.name_first + " " + row.item.name_last }}
      </template>
      <template #cell(present)="row">
        <div v-if="$store.state.position == null || (recordsExist && !editing)">
          {{ row.item.in_attendance == 1 ? "Yes" : "No" }}
        </div>
        <div v-else>
          <b-form-checkbox
            :checked="row.item.in_attendance == 1"
            @change="toggleAttendance(row.item.id)"
          ></b-form-checkbox>
        </div>
      </template>
    </b-table>
    <h5 v-else>No attendance records exist for this date.</h5>
    <div v-if="$store.state.position != null && (!recordsExist || editing)">
      <b-button
        id="cancel-button"
        v-if="recordsExist && editing"
        @click="editing = false"
        >Cancel</b-button
      >
      <b-button id="submit-button" variant="primary" @click="onSubmit()">
        {{ recordsExist ? "Update Attendance" : "Submit Attendance" }}
      </b-button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      data: {
        meeting_date: null,
        attendance: null,
      },
      fields: [
        {
          key: "roll_number",
          label: "Roll",
        },
        {
          key: "name",
        },
        { key: "present" },
      ],
      loaded: false,
      recordsExist: false,
      editing: false,
      date: null,
      activeBrothers: null,
    };
  },
  created() {
    let today = new Date();
    this.data.meeting_date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1 < 10 ? "0" : "") +
      (today.getMonth() + 1) +
      "-" +
      (today.getDate() + 1 < 10 ? "0" : "") +
      today.getDate();
    axios
      .get(this.$store.state.apiURL + "read_active.php", {
        headers: { Authorization: this.$store.state.jwt },
      })
      .then((response) => {
        this.activeBrothers = response.data.body;
        this.getRecords();
      })
      .catch((error) => {
        this.error = error;
      });
  },
  methods: {
    getRecords() {
      axios
        .get(
          this.$store.state.apiURL +
            "read_attendance.php?date=" +
            this.data.meeting_date,
          {
            headers: { Authorization: this.$store.state.jwt },
          }
        )
        .then((response) => {
          this.recordsExist = response.data.itemCount > 0;
          if (this.recordsExist) {
            this.data.attendance = response.data.body;
          } else {
            this.data.attendance = JSON.parse(
              JSON.stringify(this.activeBrothers)
            );
          }
          this.loaded = true;
        })
        .catch(() => {
          this.$root.$children[0].showError(
            "Records for this date could not be accessed"
          );
        });
    },
    toggleAttendance(id) {
      let index = this.data.attendance.findIndex((x) => x.id == id);
      let attended = this.data.attendance[index].in_attendance == 1;
      this.data.attendance[index].in_attendance = attended ? 0 : 1;
    },
    onSubmit() {
      axios
        .post(this.$store.state.apiURL + "submit_attendance.php", this.data, {
          headers: { Authorization: this.$store.state.jwt },
        })
        .then((response) => {
          this.$root.$children[0].showSuccess(response.data.message);
          this.recordsExist = true;
          this.editing = false;
        })
        .catch((error) => {
          this.$root.$children[0].showError(error);
        });
    },
  },
};
</script>

<style scoped>
h5 {
  text-align: center;
}
#select-date {
  max-width: 50%;
  margin: auto;
  margin-top: 20px;
  margin-bottom: 20px;
}
#records-exist {
  display: flex;
  margin-bottom: 20px;
  align-items: center;
  justify-content: center;
}
#edit-button {
  margin-left: 10px;
}
#cancel-button {
  margin-right: 10px;
}
</style>
