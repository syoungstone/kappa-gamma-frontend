<template>
  <StudentForm v-if="this.$store.state.isOfficer" />
</template>

<script>
import StudentForm from "@/components/StudentForm.vue";
export default {
  components: {
    StudentForm,
  },
};
</script>
