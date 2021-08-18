<template>
  <div class="narrow-wrapper">
    <h1>Assign Bigs</h1>
    <div v-if="noPledges">
      <p id="no-pledges">There are currently no pledges to be found.</p>
    </div>
    <div v-else-if="loaded">
      <div v-for="pledge in pledges" :key="pledge.id">
        <b-form-group
          class="pledge-label"
          :label="pledge.name_first + ' ' + pledge.name_last + ':'"
        >
          <vue-single-select
            v-model="pledge.selected_big"
            :options="actives"
            optionLabel="name"
            @input="saveBig(pledge)"
          ></vue-single-select>
        </b-form-group>
      </div>
    </div>
    <LoadingSpinner v-else />
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
  created() {
    this.loadActives();
  },
  data() {
    return {
      AUTH_TIERS: AUTH_TIERS,
      actives: null,
      noPledges: null,
      pledges: null,
      loaded: false,
    };
  },
  methods: {
    loadActives() {
      axios
        .get(API_URL + "read_active_id_name_only.php", {
          headers: { Authorization: this.$store.state.jwt },
        })
        .then((response) => {
          this.actives = response.data.body;
          this.loadPledges();
        })
        .catch((error) => {
          this.$root.$children[0].showError(error.response.statusText);
        });
    },
    loadPledges() {
      this.loaded = false;
      axios
        .get(API_URL + "read_pledges.php", {
          headers: { Authorization: this.$store.state.jwt },
        })
        .then((response) => {
          response.data.body.forEach((x) => {
            if (x.big != null) {
              x.selected_big = this.actives.find((y) => y.id == x.big);
            }
          });
          this.pledges = response.data.body;
          this.noPledges = response.data.itemCount == 0;
          this.loaded = true;
        })
        .catch((error) => {
          this.$root.$children[0].showError(error.response.statusText);
          this.loaded = true;
        });
    },
    saveBig(pledge) {
      if (this.bigChanged(pledge)) {
        pledge.big = pledge.selected_big ? pledge.selected_big.id : null;
        axios
          .post(API_URL + "update_student.php", pledge, {
            headers: { Authorization: this.$store.state.jwt },
          })
          .catch((error) => {
            this.loadPledges();
            this.$root.$children[0].showError(error.response.statusText);
          });
      }
    },
    bigChanged(pledge) {
      if (pledge.big != null && pledge.selected_big != null) {
        return pledge.big != pledge.selected_big.id;
      } else {
        return pledge.big != null || pledge.selected_big != null;
      }
    },
  },
};
</script>

<style scoped>
h1 {
  margin-bottom: 30px;
}
.pledge-label {
  font-weight: bold;
}
</style>
