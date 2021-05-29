<template>
  <div class="narrow-wrapper">
    <h1>
      Welcome {{ $store.state.isBrother ? "Brother" : "Pledge" }}
      {{ $store.state.lastName }}!
    </h1>
    <EventList @event-selected="eventSelected" />
  </div>
</template>

<script>
import EventList from "@/components/EventList.vue";
export default {
  components: {
    EventList,
  },
  methods: {
    eventSelected(id) {
      this.$router.push("/event/" + id, () => {});
    },
  },
};
</script>
