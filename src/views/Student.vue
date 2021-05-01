<template>
  <div id="narrow-wrapper">
    <div v-if="loaded">
      <div v-if="data.photo" class="thumbnail">
        <img :src="data.photo" alt="Profile photo" />
      </div>
      <div v-else-if="data.is_pledge == 0" class="thumbnail">
        <img src="../assets/nophoto.jpg" alt="Photo placeholder" />
      </div>
      <h2>{{ data.is_pledge == 1 ? "Pledge" : "Brother" }}</h2>
      <div class="row" id="name-row">
        <h1>
          {{ data.name_first + " " }}
          {{ data.name_middle ? data.name_middle + " " : "" }}
          {{ data.name_last }}
        </h1>
        <b-button
          id="edit-button"
          variant="primary"
          v-if="$store.state.isOfficer"
          @click="editStudent()"
          >Edit</b-button
        >
      </div>
      <div class="accordion" role="tablist">
        <b-card no-body class="mb-1">
          <b-card-header header-tag="header" class="p-1" role="tab">
            <b-button block v-b-toggle.accordion-1 variant="info"
              >Membership</b-button
            >
          </b-card-header>
          <b-collapse
            id="accordion-1"
            visible
            accordion="my-accordion"
            role="tabpanel"
          >
            <b-card-body>
              <dl>
                <dt v-if="data.nickname">Nickname</dt>
                <dd v-if="data.nickname">{{ data.nickname }}</dd>
                <dt v-if="data.roll_number">Roll Number</dt>
                <dd v-if="data.roll_number">{{ data.roll_number }}</dd>
                <dt>Pledge Class</dt>
                <dd>{{ data.pledge_class }}</dd>
                <dt v-if="data.big_name">Big</dt>
                <dd v-if="data.big_name">{{ data.big_name }}</dd>
                <dt v-if="data.lineage">Lineage</dt>
                <dd v-if="data.lineage">{{ data.lineage }}</dd>
                <dt v-if="data.brother_status">Status</dt>
                <dd v-if="data.brother_status">
                  {{
                    data.brother_status.charAt(0).toUpperCase() +
                    data.brother_status.slice(1)
                  }}
                </dd>
                <dt v-if="data.office">Position</dt>
                <dd v-if="data.office">{{ data.office }}</dd>
              </dl>
            </b-card-body>
          </b-collapse>
        </b-card>

        <b-card no-body class="mb-1">
          <b-card-header header-tag="header" class="p-1" role="tab">
            <b-button block v-b-toggle.accordion-2 variant="info"
              >Personal</b-button
            >
          </b-card-header>
          <b-collapse id="accordion-2" accordion="my-accordion" role="tabpanel">
            <b-card-body>
              <dl>
                <dt>Major</dt>
                <dd>{{ data.major }}</dd>
                <dt>Graduation Year</dt>
                <dd>{{ data.grad_year }}</dd>
                <dt>Hometown</dt>
                <dd>{{ hometown }}</dd>
              </dl>
            </b-card-body>
          </b-collapse>
        </b-card>

        <b-card no-body class="mb-1">
          <b-card-header header-tag="header" class="p-1" role="tab">
            <b-button block v-b-toggle.accordion-3 variant="info"
              >Contact</b-button
            >
          </b-card-header>
          <b-collapse id="accordion-3" accordion="my-accordion" role="tabpanel">
            <b-card-body>
              <dl>
                <dt>Email</dt>
                <dd>{{ data.email }}</dd>
                <dt>Phone</dt>
                <dd>{{ data.phone_number }}</dd>
              </dl>
            </b-card-body>
          </b-collapse>
        </b-card>
      </div>
    </div>
    <LoadingSpinner v-else />
    <div v-if="error" class="mt-3">
      <strong>{{ error }}</strong>
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
  name: "Brother",
  data() {
    return {
      id: 0,
      data: {},
      error: "",
      hometown: "",
      loaded: false,
    };
  },
  created() {
    this.id = this.$route.params.id;
    axios
      .get(this.$store.state.apiURL + "read_student.php?id=" + this.id, {
        headers: { Authorization: this.$store.state.jwt },
      })
      .then((response) => {
        this.data = response.data;
        this.loaded = true;
        if (this.data.home_country == "United States of America") {
          this.hometown =
            this.data.hometown +
            (this.data.home_state ? ", " + this.data.home_state : "");
        } else {
          this.hometown =
            this.data.hometown +
            (this.data.home_state ? ", " + this.data.home_state : "") +
            ", " +
            this.data.home_country;
        }
      })
      .catch((error) => (this.error = error));
  },
  methods: {
    editStudent() {
      this.$router.push("/edit/" + this.id, () => {});
    },
  },
};
</script>

<style>
h2 {
  text-align: center;
}
.thumbnail {
  margin: auto;
  position: relative;
  width: 200px;
  height: 200px;
  overflow: hidden;
  border: 3px solid black;
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
#name-row {
  justify-content: center;
}
#edit-button {
  margin-left: 20px;
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
