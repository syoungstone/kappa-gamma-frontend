<template>
  <StudentForm :id="$route.params.id" />
</template>

<script>
import StudentForm from "@/components/StudentForm.vue";
export default {
  components: {
    StudentForm,
  },
};
</script>
