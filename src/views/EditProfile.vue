<template>
  <EditStudent :id="$store.state.id" />
</template>

<script>
import EditStudent from "@/components/EditStudent.vue";
export default {
  components: {
    EditStudent,
  },
};
</script>
