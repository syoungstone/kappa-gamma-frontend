<template>
  <StudentForm v-if="$store.state.position != null" />
</template>

<script>
import StudentForm from "@/components/StudentForm.vue";
export default {
  components: {
    StudentForm,
  },
};
</script>
