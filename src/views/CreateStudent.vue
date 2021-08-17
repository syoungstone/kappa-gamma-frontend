<template>
  <StudentForm v-if="$store.state.authTier >= AUTH_TIERS.OFFICER" />
</template>

<script>
import { AUTH_TIERS } from "../constants/index.js";
import StudentForm from "@/components/StudentForm.vue";
export default {
  data() {
    return {
      AUTH_TIERS: AUTH_TIERS,
    };
  },
  components: {
    StudentForm,
  },
};
</script>
