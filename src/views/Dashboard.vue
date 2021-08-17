<template>
  <div class="narrow-wrapper">
    <h1>
      Welcome
      {{ $store.state.authTier > AUTH_TIERS.PLEDGE ? "Brother" : "Pledge" }}
      {{ $store.state.lastName }}!
    </h1>
    <EventList @event-selected="eventSelected" />
  </div>
</template>

<script>
import EventList from "@/components/EventList.vue";
import { AUTH_TIERS } from "../constants/index.js";
export default {
  data() {
    return {
      AUTH_TIERS: AUTH_TIERS,
    };
  },
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
