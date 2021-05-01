<template>
  <div id="narrow-wrapper">
    <b-modal v-model="notifyModal" :title="notifyModalTitle" hide-footer>
      <p>{{ notifyModalMessage }}</p>
    </b-modal>
    <h1>Initiate Pledges</h1>
    <div v-if="loaded" id="cards">
      <b-modal id="photo-modal" title="Select Photo" @ok="handleOk">
        <form ref="form" @submit.stop.prevent="handleSubmit">
          <b-form-group
            label="Please enter photo URL"
            label-for="url-input"
            invalid-feedback="Invalid URL"
            :state="photoState"
          >
            <b-form-input
              id="url-input"
              v-model="tempPhoto"
              :state="photoState"
              required
            ></b-form-input>
          </b-form-group>
        </form>
      </b-modal>
      <b-card
        v-for="pledge in pledges"
        :key="pledge.id"
        no-body
        class="overflow-hidden pledge-card"
        style="max-width: 540px"
      >
        <b-row no-gutters>
          <b-col md="5">
            <div v-if="pledge.photo" class="thumbnail">
              <img :src="pledge.photo" alt="Profile photo" />
            </div>
            <div v-else class="thumbnail">
              <img src="../assets/nophoto.jpg" alt="Photo placeholder" />
            </div>
          </b-col>
          <b-col md="7">
            <b-card-body
              :title="pledge.name_first + ' ' + pledge.name_last"
              class="card-body"
            >
              <b-form @submit="initiate(pledge)" id="create-form">
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
  created() {
    this.load();
  },
  data() {
    return {
      pledges: null,
      error: null,
      loaded: false,
      photoId: null,
      tempPhoto: null,
      photoState: null,
      notifyModal: false,
      notifyModalMessage: null,
      notifyModalTitle: null,
    };
  },
  methods: {
    selectPhoto(id) {
      this.photoId = id;
      this.$bvModal.show("photo-modal");
    },
    initiate(pledge) {
      if (pledge.roll_number < 0) {
        this.showError("Roll number must be greater than 0.");
        return false;
      } else {
        pledge.is_pledge = 0;
        pledge.brother_status = "active";
        pledge.good_standing = 1;
        axios
          .post(
            this.$store.state.apiURL + "update_student.php?id=" + pledge.id,
            pledge,
            {
              headers: { Authorization: this.$store.state.jwt },
            }
          )
          .then((response) => {
            if (response.data.success) {
              this.notifyModalTitle = "Success";
              this.notifyModalMessage = response.data.message;
              this.notifyModal = true;
              this.load();
            } else {
              this.showError(response.data.message);
            }
          })
          .catch((error) => this.showError(error));
      }
    },
    load() {
      axios
        .get(this.$store.state.apiURL + "read_pledges.php", {
          headers: { Authorization: this.$store.state.jwt },
        })
        .then((response) => {
          this.pledges = response.data.body;
          this.loaded = true;
        })
        .catch((error) => this.showError(error));
    },
    showError(error) {
      this.loaded = true;
      this.notifyModalTitle = "Error";
      this.notifyModalMessage = error;
      this.notifyModal = true;
    },
    checkUrlValidity() {
      let regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
      this.photoState = regexp.test(this.tempPhoto) || this.tempPhoto == "";
      return this.photoState;
    },
    resetModal() {
      this.photoState = null;
    },
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      // Trigger submit handler
      this.handleSubmit();
    },
    handleSubmit() {
      // Exit when the form isn't valid
      if (!this.checkUrlValidity()) {
        return;
      }
      // Save photo url
      var index = this.pledges.findIndex((x) => x.id == this.photoId);
      this.pledges[index].photo = this.tempPhoto;
      this.photoId = null;
      this.tempPhoto = null;
      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide("photo-modal");
      });
    },
  },
};
</script>

<style>
.thumbnail {
  height: 100%;
}
.thumbnail img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}
.pledge-card {
  margin-top: 20px;
  justify-content: center;
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
</style>
