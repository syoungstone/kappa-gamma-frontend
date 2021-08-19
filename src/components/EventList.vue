<template>
  <div v-if="loaded">
    <div v-if="events && events.length > 0">
      <h3 v-if="date == null && eventList == null">Upcoming events today:</h3>
      <div
        class="event"
        v-for="event in events"
        :key="event.id"
        @click="eventSelected(event.id, event.title, event.committee)"
      >
        <strong>{{ event.title }}</strong>
        <br />{{ getTimeString(event) }}
      </div>
    </div>
    <h3 v-else>
      {{
        eventList
          ? "No events on calendar"
          : date
          ? "No events scheduled for this date."
          : "No upcoming events today!"
      }}
    </h3>
    <h5 v-if="error">{{ error }}</h5>
  </div>
</template>

<script>
import axios from "axios";
import { AUTH_TIERS, API_URL } from "../constants/index.js";
export default {
  name: "EventList",
  props: {
    date: String,
    eventList: Array,
  },
  data() {
    return {
      AUTH_TIERS: AUTH_TIERS,
      from: null,
      to: null,
      events: null,
      loaded: false,
      error: null,
    };
  },
  created() {
    this.getEvents();
  },
  watch: {
    date: function () {
      this.getEvents();
    },
  },
  methods: {
    getEvents() {
      if (this.eventList) {
        this.events = this.eventList;
        this.loaded = true;
      } else {
        if (this.date) {
          this.getFromAndToFromDate();
        } else {
          this.getFromAndToUpcoming();
        }
        axios
          .get(
            API_URL + "read_events.php?from=" + this.from + "&to=" + this.to,
            {
              headers: { Authorization: this.$store.state.jwt },
            }
          )
          .then((response) => {
            this.events = response.data.body;
            this.loaded = true;
          })
          .catch((error) => {
            this.error = error.response.statusText;
            this.loaded = true;
          });
      }
    },
    getFromAndToUpcoming() {
      let date = new Date();
      this.from =
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1 < 10 ? "0" : "") +
        (date.getMonth() + 1) +
        "-" +
        (date.getDate() < 10 ? "0" : "") +
        date.getDate() +
        "T" +
        (date.getHours() < 10 ? "0" : "") +
        date.getHours() +
        ":" +
        (date.getMinutes() < 10 ? "0" : "") +
        date.getMinutes() +
        ":" +
        (date.getSeconds() < 10 ? "0" : "") +
        date.getSeconds();
      this.to =
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1 < 10 ? "0" : "") +
        (date.getMonth() + 1) +
        "-" +
        (date.getDate() < 10 ? "0" : "") +
        date.getDate() +
        "T" +
        "23:59:59";
    },
    getFromAndToFromDate() {
      this.from = this.date + "T00:00:00";
      this.to = this.date + "T23:59:59";
    },
    eventSelected(id, title, committee) {
      this.$emit("event-selected", id, title, committee);
    },
    getTimeString(event) {
      if (this.eventList) {
        let startDate = this.getDisplayDate(event.start);
        let endDate = this.getDisplayDate(event.end);
        if (event.allDay == 1) {
          return startDate == endDate
            ? startDate + " all day"
            : startDate + " to " + endDate;
        } else {
          let startTime = this.getDisplayTime(event.start);
          let endTime = this.getDisplayTime(event.end);
          return startDate == endDate
            ? startDate + " " + startTime + " to " + endTime
            : startDate + " " + startTime + " to " + endDate + " " + endTime;
        }
      } else {
        return event.allDay == 1
          ? "All day"
          : this.getDisplayTime(event.start) +
              " to " +
              this.getDisplayTime(event.end);
      }
    },
    getDisplayDate(datetime) {
      return (
        datetime.substring(5, 7) +
        "/" +
        datetime.substring(8, 10) +
        "/" +
        datetime.substring(2, 4)
      );
    },
    getDisplayTime(datetime) {
      let time = datetime.split(" ");
      let hms = time[1].split(":");
      let hour = hms[0] % 12 == 0 ? 12 : hms[0] % 12;
      let minute = hms[1];
      let ampm = hms[0] > 11 ? "pm" : "am";
      return hour + ":" + minute + ampm;
    },
  },
};
</script>

<style scoped>
.event {
  margin: 10px;
  padding: 10px;
  background-color: var(--ot-off-white);
  border-radius: 10px;
  cursor: pointer;
}
h3 {
  margin-top: 40px;
  margin-bottom: 20px;
}
h4 {
  text-align: left;
}
</style>
