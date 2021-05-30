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
      :eventId="eventId"
      @reset="reset"
    />
    <EventList v-else :date="eventDate" @event-selected="eventSelected" />
  </div>
</template>

<script>
import AttendanceTable from "@/components/AttendanceTable.vue";
import EventList from "@/components/EventList.vue";
export default {
  components: {
    AttendanceTable,
    EventList,
  },
  data() {
    return {
      showEventAttendance: false,
      eventDate: null,
      eventTitle: null,
      eventId: null,
    };
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
    eventSelected(id, title) {
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
