<template>
  <div class="narrow-wrapper">
    <AccountDisplay :id="this.$route.params.id" />
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
