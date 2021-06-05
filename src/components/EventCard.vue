<template>
  <div>
    <div id="error" v-if="error">
      <h2>Error 404</h2>
      <h3>{{ error }}</h3>
    </div>
    <div v-else-if="loaded">
      <div class="event-card">
        <h3>
          {{
            $store.state.loggedIn &&
            !$store.state.isBrother &&
            event.alt_pledge_name
              ? event.alt_pledge_name
              : event.title
          }}
        </h3>
        <div v-if="startDateString == endDateString">
          <h4>
            {{ startDateString }}
          </h4>
          <h5 v-if="event.allDay == 0">
            {{ startTimeString + " to " + endTimeString }}
          </h5>
          <h5 v-else>All day event</h5>
        </div>
        <div v-else>
          <h5>
            {{
              "From " +
              startDateString +
              (event.allDay == 1 ? "" : " at " + startTimeString)
            }}
            <br v-if="event.allDay == 0" />
            {{
              " to " +
              endDateString +
              (event.allDay == 1 ? "" : " at " + endTimeString)
            }}
          </h5>
        </div>
        <h6 v-if="event.event_location">{{ "At " + event.event_location }}</h6>
        <p v-if="event.committee_name">
          Hosted by the {{ event.committee_name }} committee
        </p>
        <p v-if="event.event_description">{{ event.event_description }}</p>
        <div
          v-if="$store.state.permissionTier >= AUTH_TIERS.BROTHER && !deleting"
        >
          <b-button class="select-button" variant="primary" @click="editEvent()"
            >Edit</b-button
          >
          <b-button
            class="select-button"
            variant="danger"
            @click="deleting = true"
            >Delete</b-button
          >
        </div>
        <div v-if="deleting && event.repeat_id == null">
          <h5>
            Are you sure you want to delete this event? Deleting an event will
            also erase attendance records for that event.
          </h5>
          <div>
            <b-button class="select-button" @click="deleting = false"
              >Cancel</b-button
            >
            <b-button
              class="select-button"
              variant="danger"
              @click="deleteEvent()"
              >Yes, Delete</b-button
            >
          </div>
        </div>
        <div id="delete-options" v-else-if="deleting">
          <h5>
            This is a repeat event. Would you like to delete this event only,
            this and following events, or all events in this sequence?<br /><br />Note
            that deleting an event will also erase attendance records for that
            event.
          </h5>
          <div>
            <b-button
              class="select-button delete-button"
              @click="deleting = false"
              >Cancel</b-button
            >
            <b-button
              class="select-button delete-button"
              variant="primary"
              @click="deleteEvent()"
              >Delete This Event Only</b-button
            >
            <b-button
              class="select-button delete-button"
              variant="warning"
              @click="deleteFollowing()"
              >Delete This And Following Events</b-button
            >
            <b-button
              class="select-button delete-button"
              variant="danger"
              @click="deleteAll()"
              >Delete All Events In Sequence</b-button
            >
          </div>
        </div>
      </div>
      <div
        id="attendance-link"
        v-if="$store.state.permissionTier >= AUTH_TIERS.BROTHER"
      >
        <b-link @click="showAttendance = !showAttendance">
          {{
            showAttendance
              ? "Hide Attendance"
              : $store.state.permissionTier >= AUTH_TIERS.OFFICER
              ? "Take Attendance"
              : "Show Attendance"
          }}
        </b-link>
      </div>
      <AttendanceTable
        v-if="showAttendance"
        :eventId="event.id"
        @reset="showAttendance = !showAttendance"
      />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { AUTH_TIERS, API_URL } from "../constants/index.js";
import AttendanceTable from "@/components/AttendanceTable.vue";
export default {
  name: "EventCard",
  props: {
    eventId: {
      required: true,
    },
  },
  components: {
    AttendanceTable,
  },
  data() {
    return {
      AUTH_TIERS: AUTH_TIERS,
      showAttendance: false,
      deleting: false,
      deleteAllFollowing: false,
      deleteAllInSequence: false,
      startDateString: null,
      endDateString: null,
      startTimeString: null,
      endTimeString: null,
      event: null,
      error: null,
      loaded: false,
    };
  },
  created() {
    axios
      .get(API_URL + "read_event.php?id=" + this.eventId, {
        headers: this.$store.state.loggedIn
          ? { Authorization: this.$store.state.jwt }
          : {},
      })
      .then((response) => {
        this.event = response.data;
        this.getTimeStrings();
        this.loaded = true;
      })
      .catch((error) => {
        this.error = error.response.statusText;
        this.loaded = true;
      });
  },
  methods: {
    getTimeStrings() {
      let start = new Date(this.event.start);
      let end = new Date(this.event.end);
      if (this.event.allDay == 1) {
        end.setDate(end.getDate() - 1);
      }
      this.startDateString = start.toLocaleDateString("en-US");
      this.endDateString = end.toLocaleDateString("en-US");
      this.startTimeString = start
        .toLocaleTimeString("en-US")
        .replace(":00 ", " ");
      this.endTimeString = end.toLocaleTimeString("en-US").replace(":00 ", " ");
    },
    editEvent() {
      this.$router.push("/editevent/" + this.eventId, () => {});
    },
    deleteFollowing() {
      this.deleteAllFollowing = true;
      this.deleteAllInSequence = false;
      this.deleteEvent();
    },
    deleteAll() {
      this.deleteAllFollowing = false;
      this.deleteAllInSequence = true;
      this.deleteEvent();
    },
    deleteEvent() {
      let apiCall =
        API_URL +
        "delete_event.php?id=" +
        this.event.id +
        (this.deleteAllInSequence || this.deleteAllFollowing
          ? "&repeat_id=" + this.event.repeat_id
          : "") +
        (this.deleteAllFollowing ? "&following=true" : "") +
        (this.deleteAllInSequence ? "&all=true" : "");
      axios
        .delete(apiCall, {
          headers: { Authorization: this.$store.state.jwt },
        })
        .then((response) => {
          this.$root.$children[0].showSuccess(response.data.message);
          this.$router.push("/dashboard", () => {});
        })
        .catch((error) => {
          this.$root.$children[0].showError(error.response.statusText);
          if (error.response.status == 404) {
            this.$router.push("/404", () => {});
          }
          this.deleteAllFollowing = false;
          this.deleteAllInSequence = false;
        });
    },
  },
};
</script>

<style scoped>
h1,
h2,
h3,
h4 {
  text-align: left;
}
.event-card {
  padding: 15px;
  background-color: var(--ot-off-white);
  border-radius: 10px;
}
.select-button {
  margin-right: 10px;
  margin-top: 10px;
}
#delete-options {
  padding: 15px;
  background-color: white;
  border-radius: 10px;
}
.delete-button {
  width: 100%;
}
#error > h2,
#error > h3 {
  text-align: center;
}
#attendance-link {
  text-align: center;
  margin: 20px;
}
</style>
