<template>
  <div class="demo-app">
    <div class="demo-app-main">
      <h5 v-if="error">{{ error }}</h5>
      <FullCalendar
        v-else
        :options="calendarOptions"
        ref="fullCalendar"
        class="calendar"
      >
        <template v-slot:eventContent="arg" class="event">
          <b>{{ arg.timeText }}</b>
          {{ arg.event.allDay ? "" : " " }}
          <i>{{ arg.event.title }}</i>
        </template>
      </FullCalendar>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
export default {
  components: {
    FullCalendar,
  },
  data: function () {
    return {
      todayStr: new Date().toISOString().replace(/T.*$/, ""),
      calendarOptions: {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        headerToolbar: {
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        },
        initialView: "dayGridMonth",
        events: null,
        dayMaxEvents: true,
        eventClick: this.handleEventClick,
        datesSet: this.handleDatesSet,
      },
      from: null,
      to: null,
      error: null,
      events: null,
      element: null,
    };
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener("resize", this.setCalendarView);
    });
    this.setCalendarView();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },
  methods: {
    setCalendarView() {
      let api = this.$refs.fullCalendar.getApi();
      if (window.innerWidth < 550) {
        this.calendarOptions.initialView = "timeGridDay";
        api.changeView("timeGridDay");
        this.calendarOptions.headerToolbar.left = "title";
        this.calendarOptions.headerToolbar.center = "";
        this.calendarOptions.headerToolbar.right = "prev,next";
      } else if (window.innerWidth < 650) {
        this.calendarOptions.initialView = "timeGridWeek";
        api.changeView("timeGridWeek");
        this.calendarOptions.headerToolbar.left = "prev,next";
        this.calendarOptions.headerToolbar.center = "title";
        this.calendarOptions.headerToolbar.right = "timeGridWeek,timeGridDay";
      } else if (window.innerWidth < 850) {
        this.calendarOptions.initialView = "timeGridWeek";
        api.changeView("timeGridWeek");
        this.calendarOptions.headerToolbar.left = "prev,next today";
        this.calendarOptions.headerToolbar.center = "title";
        this.calendarOptions.headerToolbar.right = "timeGridWeek,timeGridDay";
      } else {
        this.calendarOptions.initialView = "dayGridMonth";
        api.changeView("dayGridMonth");
        this.calendarOptions.headerToolbar.left = "prev,next today";
        this.calendarOptions.headerToolbar.center = "title";
        this.calendarOptions.headerToolbar.right =
          "dayGridMonth,timeGridWeek,timeGridDay";
      }
      this.setAspectRatio();
    },
    setAspectRatio() {
      let api = this.$refs.fullCalendar.getApi();
      if (api.view.type != "dayGridMonth") {
        api.setOption("aspectRatio", window.innerWidth / window.innerHeight);
      } else {
        api.setOption("aspectRatio", 1.35);
      }
    },
    getEvents() {
      this.setAspectRatio();
      axios
        .get(
          this.$store.state.apiURL +
            "read_events.php?from=" +
            this.from +
            "&to=" +
            this.to,
          {
            headers:
              this.$store.state.jwt != null
                ? { Authorization: this.$store.state.jwt }
                : {},
          }
        )
        .then((response) => {
          this.events = response.data.body;
          this.events.forEach((x) => (x.allDay = x.allDay == 1));
          this.calendarOptions.events = this.events;
        })
        .catch((error) => {
          this.error = error.response.statusText;
        });
    },
    handleEventClick(clickInfo) {
      this.$router.push("/event/" + clickInfo.event.id, () => {});
    },
    handleDatesSet(data) {
      // Only call getEvents() if there has been a change in start and end dates
      if (this.formatDatetime(data.start, data.end)) {
        this.getEvents();
      }
    },
    formatDatetime(start, end) {
      let oldFrom = this.from;
      let oldTo = this.to;
      this.from =
        start.getFullYear() +
        "-" +
        (start.getMonth() + 1 < 10 ? "0" : "") +
        (start.getMonth() + 1) +
        "-" +
        (start.getDate() < 10 ? "0" : "") +
        start.getDate() +
        "T00:00:00";
      this.to =
        end.getFullYear() +
        "-" +
        (end.getMonth() + 1 < 10 ? "0" : "") +
        (end.getMonth() + 1) +
        "-" +
        (end.getDate() < 10 ? "0" : "") +
        end.getDate() +
        "T00:00:00";
      return oldFrom != this.from || oldTo != this.to;
    },
  },
};
</script>

<style scoped>
.demo-app {
  display: flex;
  min-height: 100%;
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  font-size: 14px;
  padding: 1em;
}
.demo-app-main {
  flex-grow: 1;
}
.calendar /deep/ .fc-view {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
.calendar /deep/ .fc-event {
  cursor: pointer;
}
.calendar /deep/ .fc-event > span {
  max-width: 100%;
  overflow: hidden;
}
</style>
