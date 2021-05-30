<template>
  <div class="narrow-wrapper">
    <EventForm v-if="loaded" :eventData="event" @goback="goBack()" />
    <LoadingSpinner v-else />
  </div>
</template>

<script>
import axios from "axios";
import EventForm from "@/components/EventForm.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
export default {
  components: {
    EventForm,
    LoadingSpinner,
  },
  data() {
    return {
      loaded: false,
      event: null,
    };
  },
  created() {
    axios
      .get(
        this.$store.state.apiURL + "read_event.php?id=" + this.$route.params.id,
        {
          headers: { Authorization: this.$store.state.jwt },
        }
      )
      .then((response) => {
        this.event = response.data;
        this.loaded = true;
      })
      .catch((error) => {
        this.$root.$children[0].showError(error.response.statusText);
      });
  },
  methods: {
    goBack() {
      this.$router.push("/event/" + this.$route.params.id, () => {});
    },
  },
};
</script>
