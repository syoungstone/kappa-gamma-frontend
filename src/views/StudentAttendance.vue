<template>
  <div class="narrow-wrapper">
    <AttendanceDisplay :id="this.$route.params.id" />
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
