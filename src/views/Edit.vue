<template>
  <EditStudent :id="$route.params.id" />
</template>

<script>
import EditStudent from "@/components/EditStudent.vue";
export default {
  components: {
    EditStudent,
  },
};
</script>
