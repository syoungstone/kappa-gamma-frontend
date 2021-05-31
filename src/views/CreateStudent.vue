<template>
  <StudentForm v-if="$store.state.permissionTier >= $tierOfficer" />
</template>

<script>
import StudentForm from "@/components/StudentForm.vue";
export default {
  components: {
    StudentForm,
  },
};
</script>
