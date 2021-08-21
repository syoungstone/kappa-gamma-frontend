<template>
  <div v-if="loaded">
    <div v-if="eventTitle" class="row justify-content-center">
      <h2>{{ eventTitle }}</h2>
      <b-button id="inline-back-button" v-if="!onCommittee" @click="reset()"
        >Back</b-button
      >
    </div>
    <div id="records-exist" v-if="onCommittee && recordsExist && !editing">
      <div id="records-message">
        <strong>Attendance records already exist for this event.</strong>
      </div>
      <div>
        <b-button id="edit-button" variant="primary" @click="edit()"
          >Edit</b-button
        >
        <b-button id="back-button" @click="reset()">Back</b-button>
      </div>
    </div>
    <b-table
      class="b-table"
      v-if="recordsExist || onCommittee"
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
        <div v-if="!onCommittee || (recordsExist && !editing)">
          {{ row.item.in_attendance == 1 ? "Yes" : "No" }}
        </div>
        <div v-else>
          <b-form-checkbox
            :checked="row.item.in_attendance == 1"
            @change="toggleAttendance(row.item.id)"
          ></b-form-checkbox>
        </div>
      </template>
      <template #cell(excused)="row">
        <div v-if="!onCommittee || (recordsExist && !editing)">
          {{
            row.item.excused == null
              ? "N/A"
              : row.item.excused == 1
              ? "Yes"
              : "No"
          }}
        </div>
        <div v-else>
          <b-form-checkbox
            v-if="row.item.in_attendance == 0"
            :checked="row.item.excused == 1"
            @change="toggleExcused(row.item.id)"
          ></b-form-checkbox>
        </div>
      </template>
    </b-table>
    <h5 v-else id="no-records">No attendance records exist for this event.</h5>
    <div v-if="onCommittee && (!recordsExist || editing)" id="bottom-buttons">
      <b-button id="cancel-button" @click="cancel()">Cancel</b-button>
      <b-button id="submit-button" variant="primary" @click="onSubmit()">
        {{ recordsExist ? "Update Attendance" : "Submit Attendance" }}
      </b-button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { AUTH_TIERS, API_URL } from "../constants/index.js";
export default {
  name: "EventList",
  props: {
    eventTitle: {
      required: false,
    },
    eventId: {
      required: true,
    },
    onCommittee: {
      required: true,
    },
  },
  data() {
    return {
      AUTH_TIERS: AUTH_TIERS,
      loaded: false,
      showEventAttendance: false,
      data: {
        event_id: null,
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
        { key: "excused" },
      ],
      recordsExist: false,
      editing: false,
      activeBrothers: null,
    };
  },
  created() {
    axios
      .get(API_URL + "read_active.php", {
        headers: { Authorization: this.$store.state.jwt },
      })
      .then((response) => {
        this.activeBrothers = response.data.body;
        this.getRecords();
      })
      .catch((error) => {
        this.$root.$children[0].showError(error.response.statusText);
      });
  },
  methods: {
    reset() {
      this.$emit("reset");
    },
    getRecords() {
      axios
        .get(API_URL + "read_attendance.php?event=" + this.eventId, {
          headers: { Authorization: this.$store.state.jwt },
        })
        .then((response) => {
          this.recordsExist = response.data.itemCount > 0;
          if (this.recordsExist) {
            this.data.attendance = response.data.body;
          } else {
            this.data.attendance = JSON.parse(
              JSON.stringify(this.activeBrothers)
            );
          }
          this.editing = false;
          this.showEventAttendance = true;
          this.loaded = true;
        })
        .catch((error) => {
          this.$root.$children[0].showError(error.response.statusText);
        });
    },
    toggleAttendance(id) {
      let index = this.data.attendance.findIndex((x) => x.id == id);
      let attended = this.data.attendance[index].in_attendance == 1;
      attended = attended ? 0 : 1;
      this.data.attendance[index].in_attendance = attended;
      this.data.attendance[index].excused = attended ? null : 0;
    },
    toggleExcused(id) {
      let index = this.data.attendance.findIndex((x) => x.id == id);
      let excused = this.data.attendance[index].excused == 1;
      excused = excused ? 0 : 1;
      this.data.attendance[index].excused = excused;
    },
    onSubmit() {
      this.data.event_id = this.eventId;
      axios
        .post(API_URL + "submit_attendance.php", this.data, {
          headers: { Authorization: this.$store.state.jwt },
        })
        .then((response) => {
          this.$root.$children[0].showSuccess(response.data.message);
          this.recordsExist = true;
          this.editing = false;
        })
        .catch((error) => {
          this.$root.$children[0].showError(error.response.statusText);
        });
    },
    edit() {
      this.editing = true;
    },
    cancel() {
      if (this.editing) {
        this.getRecords();
      } else {
        this.reset();
      }
    },
  },
};
</script>

<style scoped>
.b-table {
  background-color: white;
}
h2 {
  margin-bottom: 20px;
}
h5 {
  text-align: center;
}
#no-records,
#records-exist,
#bottom-buttons {
  margin-bottom: 20px;
  text-align: center;
}
#records-message {
  margin: 10px;
}
#cancel-button,
#edit-button {
  margin-right: 10px;
}
#inline-back-button {
  max-height: 38px;
  margin-left: 10px;
}
</style>
