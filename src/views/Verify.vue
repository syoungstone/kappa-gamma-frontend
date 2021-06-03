<template>
  <div class="narrow-wrapper">
    <LoadingSpinner />
  </div>
</template>

<script>
import axios from "axios";
import { AUTH_TIERS, API_URL } from "../constants/index.js";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
export default {
  components: {
    LoadingSpinner,
  },
  data() {
    return {
      AUTH_TIERS: AUTH_TIERS,
      data: {
        id: "",
        verify_hash: "",
      },
    };
  },
  created() {
    this.data.id = this.$route.params.id;
    this.data.verify_hash = this.$route.params.verify_hash;
    axios
      .post(API_URL + "verify_user.php", JSON.stringify(this.data))
      .then((response) => {
        this.$root.$children[0].showSuccess(response.data.message);
        this.$router.push("/login", () => {});
      })
      .catch((error) => {
        this.$root.$children[0].showError(error.response.statusText);
        this.$router.push("/", () => {});
      });
  },
};
</script>
