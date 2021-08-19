<template>
  <div class="narrow-wrapper">
    <AttendanceDisplay :id="this.$store.state.id" />
  </div>
</template>

<script>
import AttendanceDisplay from "@/components/AttendanceDisplay.vue";
export default {
  components: {
    AttendanceDisplay,
  },
};
</script>
