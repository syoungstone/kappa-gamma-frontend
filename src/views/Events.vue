<template>
  <div class="wide-wrapper">
    <div v-if="!$store.state.loggedIn">
      <h4>This is our public calendar.</h4>
      <h5>
        Brothers and pledges, <b-link to="/login/events">log in</b-link> to see
        internal events.
      </h5>
    </div>
    <div id="header" v-else-if="$store.state.isBrother">
      <h1>Calendar</h1>
      <b-button id="nav-button" @click="createEvent()" variant="primary"
        >Create Event</b-button
      >
    </div>
    <CalendarComponent />
  </div>
</template>

<script>
import CalendarComponent from "@/components/CalendarComponent.vue";
export default {
  components: {
    CalendarComponent,
  },
  computed: {
    wideEnough() {
      return window.innerWidth > 650;
    },
  },
  methods: {
    createEvent() {
      this.$router.push("/createevent", () => {});
    },
  },
};
</script>

<style scoped>
#header {
  display: flex;
  padding-right: 1em;
  padding-left: 1em;
}
#nav-button {
  margin-left: auto;
  align-self: flex-end;
  height: 60%;
}
h5 {
  text-align: center;
}
h1 {
  text-align: left;
  padding: 0px;
  margin: 0px;
}
</style>
