<template>
  <div class="narrow-wrapper">
    <h1>
      Welcome {{ $store.state.isBrother ? "Brother" : "Pledge" }}
      {{ $store.state.lastName }}!
    </h1>
    <div v-if="loaded">
      <div v-if="events && events.length > 0">
        <h3>Upcoming events today:</h3>
        <div
          class="event"
          v-for="event in events"
          :key="event.id"
          @click="viewEvent(event.id)"
        >
          <strong>{{ event.title }}</strong>
          <br />{{
            event.allDay == 1
              ? "All day"
              : getDisplayTime(event.start) + " to " + getDisplayTime(event.end)
          }}
        </div>
      </div>
      <h3 v-else>No upcoming events today!</h3>
      <h5 v-if="error">{{ error }}</h5>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      from: null,
      to: null,
      events: null,
      loaded: false,
      error: null,
    };
  },
  created() {
    this.getFromAndTo();
    axios
      .get(
        this.$store.state.apiURL +
          "read_events.php?from=" +
          this.from +
          "&to=" +
          this.to,
        {
          headers: { Authorization: this.$store.state.jwt },
        }
      )
      .then((response) => {
        this.events = response.data.body;
        this.loaded = true;
      })
      .catch((error) => {
        this.error = error;
        this.loaded = true;
      });
  },
  methods: {
    getFromAndTo() {
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
    viewEvent(id) {
      this.$router.push("/event/" + id, () => {});
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
