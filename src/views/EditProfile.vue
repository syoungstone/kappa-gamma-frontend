<template>
  <StudentForm :id="$store.state.id" />
</template>

<script>
import StudentForm from "@/components/StudentForm.vue";
export default {
  components: {
    StudentForm,
  },
};
</script>
