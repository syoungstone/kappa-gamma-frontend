<template>
  <div class="narrow-wrapper">
    <b-modal
      id="not-good-standing-modal"
      v-model="notGoodStanding"
      title="Brother Not In Good Standing"
      @ok="submitData"
      @cancel="load"
      @close="load"
    >
      The brother you selected for this position is not in good standing. Are
      you sure you wish to proceed?
    </b-modal>
    <h1>Update Officers</h1>
    <div v-if="loaded">
      <b-card
        v-for="officer in officers"
        :key="officer.office"
        class="edit-student-card"
      >
        <b-form>
          <div class="row">
            <p>
              <strong>{{ officer.office }}</strong>
            </p>
            <b-form-checkbox
              v-model="officer.display_publicly"
              class="mb-2 mr-sm-2 mb-sm-0"
              :value="1"
              :unchecked-value="0"
              @change="saveShowOnAboutPage(officer)"
              >Show on About page</b-form-checkbox
            >
          </div>
          <vue-single-select
            v-model="officer.brother"
            :options="actives"
            option-key="id"
            optionValue="id"
            :getOptionDescription="getCustomDescription"
            @input="saveOfficer(officer)"
          ></vue-single-select>
        </b-form>
      </b-card>
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
    this.getActives();
  },
  data() {
    return {
      AUTH_TIERS: AUTH_TIERS,
      officers: null,
      actives: null,
      newOfficer: null,
      loaded: false,
      notGoodStanding: false,
    };
  },
  methods: {
    getActives() {
      axios
        .get(API_URL + "read_active.php", {
          headers: { Authorization: this.$store.state.jwt },
        })
        .then((response) => {
          this.actives = response.data.body;
          this.load();
        })
        .catch((error) => {
          this.loaded = true;
          this.$root.$children[0].showError(error.response.statusText);
        });
    },
    load() {
      axios
        .get(API_URL + "read_officers_internal.php", {
          headers: { Authorization: this.$store.state.jwt },
        })
        .then((response) => {
          response.data.body.forEach((x) => {
            if (x.id != null) {
              x.brother = this.actives.find((y) => y.id == x.id);
            }
          });
          this.officers = response.data.body;
          this.loaded = true;
        })
        .catch((error) => {
          this.loaded = true;
          this.$root.$children[0].showError(error.response.statusText);
        });
    },
    getCustomDescription(option) {
      return option.name_first + " " + option.name_last;
    },
    saveOfficer(officer) {
      if (this.hasChanged(officer)) {
        this.newOfficer = officer;
        let id = this.newOfficer.brother ? this.newOfficer.brother.id : null;
        if (
          id == null ||
          !this.officers.find(
            (x) => x.id == id && x.office != this.newOfficer.office
          )
        ) {
          let activesIndex = this.actives.findIndex((x) => x.id == id);
          if (
            activesIndex >= 0 &&
            (this.actives[activesIndex].exceeds_unexcused == 1 ||
              this.actives[activesIndex].exceeds_owed == 1)
          ) {
            this.notGoodStanding = true;
          } else {
            this.submitData();
          }
        } else {
          this.load();
          this.$root.$children[0].showError(
            "One brother may not hold multiple positions."
          );
        }
      }
    },
    saveShowOnAboutPage(officer) {
      this.newOfficer = officer;
      this.submitData();
    },
    hasChanged(officer) {
      if (officer.id != null && officer.brother != null) {
        return officer.id != officer.brother.id;
      } else {
        return officer.id != null || officer.brother != null;
      }
    },
    submitData() {
      this.notGoodStanding = false;
      this.newOfficer.id = this.newOfficer.brother
        ? this.newOfficer.brother.id
        : null;
      axios
        .post(API_URL + "update_officer.php", this.newOfficer, {
          headers: { Authorization: this.$store.state.jwt },
        })
        .then((response) => {
          this.$root.$children[0].showSuccess(response.data.message);
        })
        .catch((error) => {
          this.load();
          this.$root.$children[0].showError(error.response.statusText);
        });
    },
  },
};
</script>

<style scoped>
.row {
  margin: 0px;
  justify-content: space-between;
}
</style>
