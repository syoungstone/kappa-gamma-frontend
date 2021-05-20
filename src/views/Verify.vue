<template>
  <div class="narrow-wrapper">
    <LoadingSpinner />
  </div>
</template>

<script>
import axios from "axios";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
export default {
  components: {
    LoadingSpinner,
  },
  data() {
    return {
      data: {
        id: "",
        verify_hash: "",
      },
      error: null,
    };
  },
  created() {
    this.data.id = this.$route.params.id;
    this.data.verify_hash = this.$route.params.verify_hash;
    axios
      .post(
        this.$store.state.apiURL + "verify_user.php",
        JSON.stringify(this.data)
      )
      .then((response) => {
        this.$root.$children[0].showSuccess(response.data.message);
        this.$router.push("/login", () => {});
      })
      .catch((error) => {
        this.error = error;
        this.$root.$children[0].showError(
          "We were unable to verify your account at this time. Please check your verification URL and try again."
        );
        this.$router.push("/", () => {});
      });
  },
};
</script>
