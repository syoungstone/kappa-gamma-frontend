<template>
  <div class="narrow-wrapper">
    <h1>Attendance Records</h1>
    <div id="select-date">
      <b-form-datepicker
        v-model="eventDate"
        :date-format-options="{
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        }"
        @input="reset()"
        required
      ></b-form-datepicker>
    </div>
    <AttendanceTable
      v-if="showEventAttendance"
      :eventTitle="eventTitle"
      :onCommittee="onCommittee"
      :eventId="eventId"
      @reset="reset"
    />
    <EventList v-else :date="eventDate" @event-selected="eventSelected" />
  </div>
</template>

<script>
import { AUTH_TIERS } from "../constants/index.js";
import AttendanceTable from "@/components/AttendanceTable.vue";
import EventList from "@/components/EventList.vue";
export default {
  components: {
    AttendanceTable,
    EventList,
  },
  data() {
    return {
      AUTH_TIERS: AUTH_TIERS,
      showEventAttendance: false,
      eventDate: null,
      eventTitle: null,
      committee: null,
      eventId: null,
    };
  },
  computed: {
    onCommittee() {
      return (
        this.$store.state.authTier >= AUTH_TIERS.OFFICER ||
        (this.committee != null &&
          this.$store.state.committees != null &&
          this.$store.state.committees.find((x) => x.value == this.committee))
      );
    },
  },
  created() {
    let today = new Date();
    this.eventDate =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1 < 10 ? "0" : "") +
      (today.getMonth() + 1) +
      "-" +
      (today.getDate() + 1 < 10 ? "0" : "") +
      today.getDate();
  },
  methods: {
    reset() {
      this.showEventAttendance = false;
      this.eventTitle = null;
      this.eventId = null;
    },
    eventSelected(id, title, committee) {
      this.committee = committee;
      this.showEventAttendance = true;
      this.eventId = id;
      this.eventTitle = title;
    },
  },
};
</script>

<style scoped>
#select-date {
  max-width: 50%;
  margin: auto;
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
