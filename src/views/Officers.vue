<template>
  <div class="narrow-wrapper">
    <div class="row" id="name-row">
      <h1>Officers</h1>
      <b-button
        id="edit-button"
        variant="primary"
        v-if="$store.state.position"
        @click="editOfficers()"
        >Edit</b-button
      >
    </div>
    <div v-if="loaded">
      <b-card
        v-for="officer in officers"
        :key="officer.importance"
        no-body
        class="overflow-hidden student-card"
        style="max-width: 540px"
        @click="redirect(officer.id)"
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
        this.loaded = true;
      })
      .catch((error) => {
        this.loaded = true;
        this.$root.$children[0].showError(error);
      });
  },
  data() {
    return {
      officers: null,
      loaded: false,
    };
  },
  methods: {
    redirect(id) {
      if (id != null) {
        this.$router.push("/student/" + id, () => {});
      } else {
        let modalTitle = "Position Vacant";
        let modalMessage =
          "There is no student information to display for this position.";
        this.$root.$children[0].showMessage(modalTitle, modalMessage);
      }
    },
    editOfficers() {
      this.$router.push("/update-officers/", () => {});
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
#edit-button {
  margin-left: 20px;
  margin-top: 10px;
  margin-bottom: 10px;
}
#name-row {
  justify-content: center;
}
</style>
