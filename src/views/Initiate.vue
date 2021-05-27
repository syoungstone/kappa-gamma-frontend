<template>
  <div class="narrow-wrapper">
    <h1>Initiate Pledges</h1>
    <div v-if="noPledges">
      <p id="no-pledges">There are currently no pledges to be found.</p>
    </div>
    <div v-else-if="loaded" id="cards">
      <PhotoModal :show="showPhotoModal" @update-photo="updatePhoto" />
      <b-card
        v-for="pledge in pledges"
        :key="pledge.id"
        no-body
        class="overflow-hidden pledge-card"
        style="max-width: 540px"
      >
        <b-row no-gutters>
          <b-col md="5">
            <ProfilePhoto class="profile-photo" :photo="pledge.photo" />
          </b-col>
          <b-col md="7">
            <b-card-body
              :title="pledge.name_first + ' ' + pledge.name_last"
              class="card-body"
            >
              <b-form @submit.prevent="initiate(pledge)" id="create-form">
                <b-form-group
                  class
                  id="input-group-0"
                  label="Roll Number:"
                  label-for="input-0"
                >
                  <b-form-input
                    id="input-0"
                    v-model="pledge.roll_number"
                    type="number"
                    required
                  ></b-form-input>
                </b-form-group>
                <b-button class="photo-button" @click="selectPhoto(pledge.id)"
                  >Upload Photo</b-button
                >
                <b-button variant="primary" type="submit">Initiate</b-button>
              </b-form>
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
import ProfilePhoto from "@/components/ProfilePhoto.vue";
import PhotoModal from "@/components/PhotoModal.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
export default {
  components: {
    ProfilePhoto,
    PhotoModal,
    LoadingSpinner,
  },
  created() {
    this.load();
  },
  data() {
    return {
      noPledges: null,
      pledges: null,
      loaded: false,
      showPhotoModal: false,
      photoId: null,
    };
  },
  methods: {
    selectPhoto(id) {
      this.photoId = id;
      this.showPhotoModal = true;
    },
    initiate(pledge) {
      if (pledge.roll_number <= 0) {
        this.$root.$children[0].showError(
          "Roll number must be greater than 0."
        );
        return false;
      } else if (pledge.roll_number < parseInt(pledge.big_roll_number)) {
        this.$root.$children[0].showError(
          "Roll number must be greater than big's roll number."
        );
      } else {
        pledge.is_pledge = 0;
        pledge.brother_status = "active";
        pledge.good_standing = 1;
        pledge.photo = pledge.photo ? pledge.photo : null;
        axios
          .post(
            this.$store.state.apiURL + "update_student.php?id=" + pledge.id,
            pledge,
            {
              headers: { Authorization: this.$store.state.jwt },
            }
          )
          .then((response) => {
            this.$root.$children[0].showSuccess(response.data.message);
            this.load();
          })
          .catch((error) =>
            this.$root.$children[0].showError(error.response.statusText)
          );
      }
    },
    load() {
      axios
        .get(this.$store.state.apiURL + "read_pledges.php", {
          headers: { Authorization: this.$store.state.jwt },
        })
        .then((response) => {
          this.pledges = response.data.body;
          this.noPledges = response.data.itemCount == 0;
          this.loaded = true;
        })
        .catch((error) => {
          this.$root.$children[0].showError(error.response.statusText);
          this.loaded = true;
        });
    },
    updatePhoto(photo) {
      var index = this.pledges.findIndex((x) => x.id == this.photoId);
      this.pledges[index].photo = photo;
      this.photoId = null;
      this.showPhotoModal = false;
    },
  },
};
</script>

<style scoped>
h4 {
  text-align: left;
}
.profile-photo {
  height: 210px;
}
.pledge-card {
  margin-top: 20px;
  justify-content: center;
}
.card-body {
  margin-left: 10px;
}
#cards {
  justify-content: center;
}
#input-0 {
  width: 50%;
}
.photo-button {
  margin-right: 10px;
}
#no-pledges {
  text-align: center;
}
</style>
