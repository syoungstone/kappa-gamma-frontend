<template>
  <div class="wide-wrapper">
    <b-modal
      id="not-good-standing-modal"
      v-model="notGoodStanding"
      title="Brother Not In Good Standing"
      @ok="submitData"
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
            <p class="officer-label">
              <strong>{{ officer.office }}</strong>
            </p>
            <vue-single-select
              class="officer-select"
              v-model="officer.brother"
              :options="actives"
              option-key="id"
              optionValue="id"
              required
              :getOptionDescription="getCustomDescription"
            ></vue-single-select>
            <b-form-checkbox
              v-model="officer.display_publicly"
              class="mb-2 mr-sm-2 mb-sm-0 officer-checkbox"
              :value="1"
              :unchecked-value="0"
              >Show on About page</b-form-checkbox
            >
            <b-button
              variant="primary"
              @click="save(officer.office)"
              class="officer-button"
              >Save Changes</b-button
            >
          </div>
        </b-form>
      </b-card>
    </div>
    <LoadingSpinner v-else />
  </div>
</template>

<script>
import axios from "axios";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
export default {
  components: {
    LoadingSpinner,
  },
  created() {
    axios
      .get(this.$store.state.apiURL + "read_officers_internal.php", {
        headers: { Authorization: this.$store.state.jwt },
      })
      .then((response) => {
        this.officers = response.data.body;
        this.getActives();
      })
      .catch((error) => {
        this.loaded = true;
        this.$root.$children[0].showError(error.response.statusText);
      });
  },
  data() {
    return {
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
        .get(this.$store.state.apiURL + "read_active.php", {
          headers: { Authorization: this.$store.state.jwt },
        })
        .then((response) => {
          this.actives = response.data.body;
          this.officers.forEach((x) => {
            if (x.id != null) {
              x.brother = this.actives.find((y) => y.id == x.id);
            }
          });
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
    save(office) {
      this.newOfficer = this.officers.find((x) => x.office == office);
      this.newOfficer.id = this.newOfficer.brother
        ? this.newOfficer.brother.id
        : null;
      if (
        this.newOfficer.id == null ||
        !this.officers.find(
          (x) =>
            x.id == this.newOfficer.id && x.office != this.newOfficer.office
        )
      ) {
        let activesIndex = this.actives.findIndex(
          (x) => x.id == this.newOfficer.id
        );
        if (
          this.actives[activesIndex].exceeds_unexcused == 1 ||
          this.actives[activesIndex].exceeds_owed == 1
        ) {
          this.notGoodStanding = true;
        } else {
          this.submitData();
        }
      } else {
        this.newOfficer = null;
        this.$root.$children[0].showError(
          "One brother may not hold multiple positions."
        );
      }
    },
    submitData() {
      this.notGoodStanding = false;
      axios
        .post(
          this.$store.state.apiURL + "update_officer.php",
          this.newOfficer,
          {
            headers: { Authorization: this.$store.state.jwt },
          }
        )
        .then((response) => {
          this.$root.$children[0].showSuccess(response.data.message);
        })
        .catch((error) =>
          this.$root.$children[0].showError(error.response.statusText)
        );
    },
  },
};
</script>

<style scoped>
h4 {
  text-align: left;
}
.student-card {
  cursor: pointer;
}
.card-body {
  margin-left: 10px;
}
.officer-label,
.officer-select {
  width: 250px;
}
.officer-label {
  text-align: right;
  margin-right: 20px;
  margin-bottom: 0;
  margin-top: 6px;
  align-content: center;
}
.officer-checkbox {
  margin-left: 50px;
}
.officer-checkbox {
  display: flex;
  align-items: center;
}
.officer-button {
  margin-left: 50px;
}
</style>
