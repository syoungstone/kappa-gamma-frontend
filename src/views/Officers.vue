<template>
  <div>
    <div v-if="$store.state.isOfficer" id="wide-wrapper">
      <h1>Officers</h1>
      <div v-if="loaded">
        <b-card
          v-for="officer in officers"
          :key="officer.office"
          class="officer-card"
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
    <div v-else id="narrow-wrapper">
      <h1>Officers</h1>
      <div v-if="loaded">
        <b-card
          v-for="officer in officers"
          :key="officer.importance"
          no-body
          class="overflow-hidden officer-card"
          style="max-width: 540px"
        >
          <b-row no-gutters>
            <b-col md="5">
              <div v-if="officer.photo" class="thumbnail">
                <img :src="officer.photo" alt="Profile photo" />
              </div>
              <div v-else class="thumbnail">
                <img src="../assets/nophoto.jpg" alt="Photo placeholder" />
              </div>
            </b-col>
            <b-col md="7">
              <b-card-body :title="officer.office" class="card-body">
                <p>
                  <strong>{{
                    officer.id
                      ? officer.name_first + " " + officer.name_last
                      : "VACANT"
                  }}</strong>
                </p>
                <p v-if="officer.id">
                  {{ officer.major + " " + officer.grad_year }}
                </p>
              </b-card-body>
            </b-col>
          </b-row>
        </b-card>
      </div>
      <LoadingSpinner v-else />
    </div>
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
        this.officers.forEach(
          (x) => (x.display_publicly = x.display_publicly == 1)
        );
        this.getActives();
      })
      .catch((error) => {
        this.loaded = true;
        this.$root.$children[0].showError(error);
      });
  },
  data() {
    return {
      officers: null,
      actives: null,
      newOfficer: null,
      loaded: false,
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
          this.$root.$children[0].showError(error);
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
        axios
          .post(
            this.$store.state.apiURL + "update_officer.php",
            this.newOfficer,
            {
              headers: { Authorization: this.$store.state.jwt },
            }
          )
          .then((response) => {
            if (response.data.success) {
              this.$root.$children[0].showSuccess(response.data.message);
            } else {
              this.$root.$children[0].showError(response.data.message);
            }
          })
          .catch((error) => this.$root.$children[0].showError(error));
      } else {
        this.newOfficer = null;
        this.$root.$children[0].showError(
          "One brother may not hold multiple positions."
        );
      }
    },
  },
};
</script>

<style>
#wide-wrapper {
  max-width: 1000px;
  padding: 20px;
  margin: 50px auto;
}
h1 {
  text-align: center;
}
.thumbnail {
  position: relative;
  width: 200px;
  height: 200px;
  overflow: hidden;
}
.thumbnail img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}
.thumbnail img.portrait {
  width: 100%;
  height: auto;
}
.officer-card {
  margin-top: 20px;
  background-color: rgb(211, 234, 241);
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
