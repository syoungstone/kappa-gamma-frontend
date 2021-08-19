<template>
  <div class="narrow-wrapper">
    <AccountDisplay :id="this.$store.state.id" />
  </div>
</template>

<script>
import AccountDisplay from "@/components/AccountDisplay.vue";
export default {
  components: {
    AccountDisplay,
  },
};
</script>
