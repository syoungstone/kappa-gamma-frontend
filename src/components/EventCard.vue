<template>
  <div>
    <div id="error" v-if="error">
      <h2>Error 404</h2>
      <h3>{{ error }}</h3>
    </div>
    <div v-else-if="loaded" class="event-card">
      <h3>
        {{
          $store.state.isPledge && event.alt_pledge_name
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
      <div v-if="$store.state.isBrother && !deleting">
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
      <div v-if="deleting">
        <h5>Are you sure you want to delete this event?</h5>
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
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "EventCard",
  props: {
    eventId: {
      required: true,
    },
  },
  data() {
    return {
      deleting: false,
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
      .get(this.$store.state.apiURL + "read_event.php?id=" + this.eventId, {
        headers:
          this.$store.state.jwt != null
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
    deleteEvent() {
      axios
        .delete(
          this.$store.state.apiURL + "delete_event.php?id=" + this.event.id,
          {
            headers: { Authorization: this.$store.state.jwt },
          }
        )
        .then((response) => {
          this.$root.$children[0].showSuccess(response.data.message);
          this.$router.push("/dashboard", () => {});
        })
        .catch((error) =>
          this.$root.$children[0].showError(error.response.statusText)
        );
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
#error > h2,
#error > h3 {
  text-align: center;
}
</style>
