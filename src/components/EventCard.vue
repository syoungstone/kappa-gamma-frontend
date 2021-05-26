<template>
  <div>
    <div v-if="error">{{ error }}</div>
    <div v-else-if="loaded" class="event-card">
      <h3>
        {{
          $store.state.isPledge && event.alt_pledge_name
            ? event.alt_pledge_name
            : event.event_name
        }}
      </h3>
      <div v-if="fromDateString == toDateString">
        <h4>
          {{ fromDateString }}
        </h4>
        <h5>{{ fromTimeString + " to " + toTimeString }}</h5>
      </div>
      <div v-else>
        <h5>
          {{ "From " + fromDateString + " at " + fromTimeString }} <br />
          {{ " to " + toDateString + " at " + toTimeString }}
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
      fromDateString: null,
      toDateString: null,
      fromTimeString: null,
      toTimeString: null,
      event: null,
      error: null,
      loaded: false,
    };
  },
  created() {
    axios
      .get(this.$store.state.apiURL + "read_event.php?id=" + this.eventId, {
        headers: { Authorization: this.$store.state.jwt },
      })
      .then((response) => {
        this.event = response.data;
        this.getTimeStrings();
        this.loaded = true;
      })
      .catch((error) => {
        this.error = error;
        this.loaded = true;
      });
  },
  methods: {
    getTimeStrings() {
      let from = new Date(this.event.from_datetime.replace(" ", "T"));
      let to = new Date(this.event.to_datetime.replace(" ", "T"));
      this.fromDateString = from.toLocaleDateString("en-US");
      this.toDateString = to.toLocaleDateString("en-US");
      this.fromTimeString = from
        .toLocaleTimeString("en-US")
        .replace(":00 ", " ");
      this.toTimeString = to.toLocaleTimeString("en-US").replace(":00 ", " ");
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
          this.$emit("deleted");
        })
        .catch(() => {
          this.$root.$children[0].showError("Event could not be deleted.");
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
</style>
