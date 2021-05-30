<template>
  <div v-if="loaded">
    <h2 v-if="eventTitle">{{ eventTitle }}</h2>
    <div
      id="records-exist"
      v-if="$store.state.position != null && recordsExist && !editing"
    >
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
    <h5 v-else>No attendance records exist for this event.</h5>
    <div
      v-if="$store.state.position != null && (!recordsExist || editing)"
      id="bottom-buttons"
    >
      <b-button id="cancel-button" @click="cancel()">Cancel</b-button>
      <b-button id="submit-button" variant="primary" @click="onSubmit()">
        {{ recordsExist ? "Update Attendance" : "Submit Attendance" }}
      </b-button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "EventList",
  props: {
    eventTitle: {
      required: false,
    },
    eventId: {
      required: true,
    },
  },
  data() {
    return {
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
      ],
      recordsExist: false,
      editing: false,
      activeBrothers: null,
    };
  },
  created() {
    axios
      .get(this.$store.state.apiURL + "read_active.php", {
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
        .get(
          this.$store.state.apiURL +
            "read_attendance.php?event=" +
            this.eventId,
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
      this.data.attendance[index].in_attendance = attended ? 0 : 1;
    },
    onSubmit() {
      this.data.event_id = this.eventId;
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
h5 {
  text-align: center;
}
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
</style>
