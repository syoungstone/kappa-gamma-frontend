<template>
  <div class="narrow-wrapper">
    <EventCard
      :eventId="this.$route.params.id"
      @deleted="hasHistory() ? $router.go(-1) : $router.push('/')"
    />
  </div>
</template>

<script>
import EventCard from "@/components/EventCard.vue";
export default {
  components: {
    EventCard,
  },
  methods: {
    hasHistory() {
      return window.history.length > 2;
    },
  },
};
</script>
