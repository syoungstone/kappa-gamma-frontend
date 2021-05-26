<template>
  <div class="wide-wrapper">
    <div v-if="!$store.state.loggedIn">
      <h4>This is our public calendar.</h4>
      <h5>
        Brothers and pledges, <b-link to="/login/events">log in</b-link> to see
        internal events.
      </h5>
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
};
</script>

<style scoped>
h5 {
  text-align: center;
}
</style>
