<template>
  <div class="narrow-wrapper">
    <div v-if="loaded">
      <ProfilePhoto
        class="profile-photo"
        v-if="data.is_pledge == 0"
        :photo="data.photo"
      />
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
          v-if="$store.state.position != null || id == $store.state.id"
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
                <dt>Major(s)</dt>
                <dd>
                  <div v-for="major in data.majors" :key="major">
                    {{ major }}
                  </div>
                </dd>
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
                <dt>Email(s)</dt>
                <dd>
                  <div v-for="email in data.emails" :key="email">
                    {{ email }}
                  </div>
                </dd>
                <dt>Phone</dt>
                <dd>{{ data.phone_number }}</dd>
              </dl>
            </b-card-body>
          </b-collapse>
        </b-card>
      </div>
    </div>
    <LoadingSpinner v-else />
  </div>
</template>

<script>
import axios from "axios";
import ProfilePhoto from "@/components/ProfilePhoto.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
export default {
  components: {
    ProfilePhoto,
    LoadingSpinner,
  },
  name: "Brother",
  data() {
    return {
      id: 0,
      data: {},
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
      .catch((error) => {
        this.$root.$children[0].showError(error.response.statusText);
        if (error.response.status == 404) {
          this.$router.push("/404", () => {});
        } else if (error.response.status == 401) {
          this.$router.push("/", () => {});
        }
      });
  },
  methods: {
    editStudent() {
      if (this.$store.state.position != null) {
        this.$router.push("/editstudent/" + this.id, () => {});
      } else {
        this.$router.push("/editprofile", () => {});
      }
    },
  },
};
</script>

<style scoped>
.profile-photo {
  margin: auto;
  border: 3px solid black;
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
