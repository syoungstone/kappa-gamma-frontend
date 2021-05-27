<template>
  <div class="narrow-wrapper">
    <EventCard :eventId="this.$route.params.id" />
  </div>
</template>

<script>
import EventCard from "@/components/EventCard.vue";
export default {
  components: {
    EventCard,
  },
};
</script>
