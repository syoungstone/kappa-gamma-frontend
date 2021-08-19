<template>
  <div class="narrow-wrapper">
    <div v-if="created" id="created">
      <h2>{{ response }}</h2>
      <b-button class="selection-button" @click="viewCreated()">{{
        "View " + (data.is_pledge == 1 ? "Pledge" : "Brother")
      }}</b-button>
      <b-button class="selection-button" @click="reset()"
        >Create Another</b-button
      >
    </div>
    <div v-else-if="newEntry && loaded && data.is_pledge == null" id="buttons">
      <h2>Would you like to create an entry for a pledge or a brother?</h2>
      <b-button class="selection-button" @click="data.is_pledge = 1"
        >Create Pledge</b-button
      >
      <b-button class="selection-button" @click="data.is_pledge = 0"
        >Create Brother</b-button
      >
    </div>
    <b-form @submit.prevent="onSubmit" v-else-if="loaded">
      <a id="show" @click="show()">
        <ProfilePhoto
          class="profile-photo"
          v-if="isBrother && $store.state.authTier >= AUTH_TIERS.OFFICER"
          :photo="data.photo"
          :editable="true"
        />
      </a>

      <PhotoModal :show="showPhotoModal" @update-photo="updatePhoto" />

      <b-modal id="big-modal" ref="modal" title="Assign Big" @ok="changeBig">
        <form ref="form" v-if="bigsLoaded" @submit.stop.prevent="handleSubmit">
          <b-form-group id="input-group-x" label-for="input-x">
            <vue-single-select
              inputId="input-x"
              v-model="newBig"
              :options="bigs"
              option-key="id"
              option-label="full_name"
              required
              :getOptionDescription="getCustomDescriptionBig"
            ></vue-single-select>
          </b-form-group>
        </form>
        <LoadingSpinner v-else />
        <div v-if="bigsError" class="mt-3">
          <strong>{{ bigsError }}</strong>
        </div>
      </b-modal>

      <h1 v-if="!newEntry">
        {{ data.name_first + " " }}
        {{ data.name_middle ? data.name_middle + " " : "" }}
        {{ data.name_last }}
      </h1>

      <h3 v-if="$store.state.authTier >= AUTH_TIERS.OFFICER">Membership</h3>

      <b-form-group
        v-if="isBrother && $store.state.authTier >= AUTH_TIERS.OFFICER"
        id="select-group-0"
        label="Status:"
        label-for="select-0"
      >
        <b-form-select
          id="select-0"
          v-model="newBrotherStatus"
          :options="statusOptions"
          :required="isBrother && $store.state.authTier >= AUTH_TIERS.OFFICER"
        ></b-form-select>
      </b-form-group>

      <b-form-group
        v-if="newlyEarlyAlum"
        id="newly-early-alum"
        label="Please select when this brother first went early alum:"
        label-for="select-semester"
      >
        <div id="newly-early-alum-fields">
          <b-form-select
            id="select-semester"
            :options="[
              { text: 'Semester', value: null },
              { text: 'Fall', value: 'F' },
              { text: 'Spring', value: 'S' },
            ]"
            v-model="earlyAlumSemester"
            placeholder="Semester"
            required
          ></b-form-select>
          <b-form-input
            id="input-year"
            type="number"
            placeholder="Year"
            v-model="earlyAlumYear"
            required
          ></b-form-input>
        </div>
      </b-form-group>

      <b-form-group
        v-if="isBrother && $store.state.authTier >= AUTH_TIERS.OFFICER"
        id="input-group-0"
        label="Roll Number:"
        label-for="input-0"
      >
        <b-form-input
          id="input-0"
          v-model="data.roll_number"
          type="number"
          :required="isBrother && $store.state.authTier >= AUTH_TIERS.OFFICER"
        ></b-form-input>
      </b-form-group>

      <b-form-group
        v-if="$store.state.authTier >= AUTH_TIERS.OFFICER"
        id="input-group-pledge-class"
        label="Pledge Class:"
        label-for="input-pledge-class"
      >
        <vue-single-select
          inputId="input-pledge-class"
          v-model="data.pledge_class"
          :options="pledgeClasses"
          :required="$store.state.authTier >= AUTH_TIERS.OFFICER"
        ></vue-single-select>
      </b-form-group>

      <b-form-group
        v-if="$store.state.authTier >= AUTH_TIERS.OFFICER"
        id="input-group-d"
        label="Nickname:"
        label-for="input-d"
      >
        <b-form-input id="input-d" v-model="data.nickname"></b-form-input>
      </b-form-group>

      <b-form-group
        v-if="$store.state.authTier >= AUTH_TIERS.OFFICER"
        id="input-group-big"
        label="Big:"
        label-for="input-big"
      >
        <div class="input-group mb-3">
          <input
            disabled
            v-model="data.big_name"
            type="text"
            class="form-control"
            placeholder="None selected"
          />
          <div class="input-group-append">
            <button
              class="btn btn-secondary"
              type="button"
              v-b-modal.big-modal
              @click="loadBigs()"
            >
              Change
            </button>
          </div>
        </div>
      </b-form-group>

      <h3>Personal</h3>

      <b-form-group
        v-if="$store.state.authTier >= AUTH_TIERS.OFFICER"
        id="input-group-a"
        label="First Name:"
        label-for="input-a"
      >
        <b-form-input
          id="input-a"
          v-model="data.name_first"
          :required="$store.state.authTier >= AUTH_TIERS.OFFICER"
        ></b-form-input>
      </b-form-group>

      <b-form-group
        v-if="$store.state.authTier >= AUTH_TIERS.OFFICER"
        id="input-group-b"
        label="Middle Name:"
        label-for="input-b"
      >
        <b-form-input id="input-b" v-model="data.name_middle"></b-form-input>
      </b-form-group>

      <b-form-group
        v-if="$store.state.authTier >= AUTH_TIERS.OFFICER"
        id="input-group-c"
        label="Last Name:"
        label-for="input-c"
      >
        <b-form-input
          id="input-c"
          v-model="data.name_last"
          :required="$store.state.authTier >= AUTH_TIERS.OFFICER"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="Major(s):">
        <MajorSelect
          v-for="(major, index) in data.majors"
          :key="index"
          :major="data.majors[index]"
          :index="index"
          :showDelete="data.majors.length > 1"
          @delete-major="deleteMajor"
          @update-major="updateMajor"
        />
        <b-button @click="addMajor()">Add Major</b-button>
      </b-form-group>

      <b-form-group
        id="input-group-3"
        label="Graduation Year:"
        label-for="input-3"
        invalid-feedback="Not a valid graduation year."
        :state="state2"
      >
        <b-form-input
          id="input-3"
          v-model="data.grad_year"
          type="number"
          :state="state2"
          required
          @input="updateState2()"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-4" label="Hometown:" label-for="input-4">
        <b-form-input
          id="input-4"
          v-model="data.hometown"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group
        v-if="data.home_country == 'United States of America'"
        id="input-group-y"
        label="Home State:"
        label-for="input-y"
      >
        <vue-single-select
          inputId="input-y"
          v-model="newState"
          :options="US_STATE_LIST"
          option-key="abbreviation"
          option-label="name"
          :required="data.home_country == 'United States of America'"
          :getOptionDescription="getCustomDescriptionState"
        ></vue-single-select>
      </b-form-group>

      <b-form-group
        id="input-group-x"
        label="Home Country:"
        label-for="input-x"
      >
        <vue-single-select
          inputId="input-x"
          v-model="data.home_country"
          :options="COUNTRY_LIST"
          required
        ></vue-single-select>
      </b-form-group>

      <h3>Contact</h3>

      <b-form-group id="input-group-e" label="Email(s):">
        <div
          class="input-group mb-3"
          v-for="(email, index) in data.emails"
          :key="index"
        >
          <input
            v-model="data.emails[index]"
            type="email"
            class="form-control"
            required
          />
          <div class="input-group-append">
            <button
              class="btn btn-danger"
              type="button"
              v-if="data.emails.length > 1"
              @click="deleteEmail(index)"
            >
              Delete
            </button>
          </div>
        </div>
        <b-button @click="addEmail()">Add Email</b-button>
      </b-form-group>

      <b-form-group
        id="input-group-1"
        label="Phone Number:"
        label-for="input-1"
        invalid-feedback="Phone number must be exactly 10 digits."
        :state="state1"
      >
        <b-form-input
          id="input-1"
          v-model="phoneString"
          type="tel"
          :state="state1"
          @input="updateState1()"
          required
        ></b-form-input>
      </b-form-group>

      <div class="position-sticky">
        <b-button type="submit" variant="primary" :disabled="submitDisabled">{{
          newEntry
            ? "Create " + (data.is_pledge ? "Pledge" : "Brother")
            : "Save Changes"
        }}</b-button>
      </div>
    </b-form>
    <LoadingSpinner v-else />
  </div>
</template>

<script>
import axios from "axios";
import {
  AUTH_TIERS,
  API_URL,
  COUNTRY_LIST,
  US_STATE_LIST,
} from "../constants/index.js";
import ProfilePhoto from "@/components/ProfilePhoto.vue";
import PhotoModal from "@/components/PhotoModal.vue";
import MajorSelect from "@/components/MajorSelect.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
export default {
  name: "StudentForm",
  props: {
    id: String,
  },
  components: {
    ProfilePhoto,
    PhotoModal,
    MajorSelect,
    LoadingSpinner,
  },
  computed: {
    submitDisabled() {
      return !(
        (this.state1 || this.state1 == null) &&
        (this.state2 || this.state2 == null)
      );
    },
    isBrother() {
      return this.data.is_pledge == 0;
    },
    newlyEarlyAlum() {
      return (
        this.newBrotherStatus == "early alum" &&
        this.data.brother_status != "early alum"
      );
    },
    phoneNumberIsValid() {
      if (this.phoneNumber == null || this.phoneNumber == "") {
        return null;
      }
      const regex = new RegExp("[0-9]{10}");
      return regex.test(this.phoneNumber) && this.phoneNumber.length == 10;
    },
    gradYearIsValid() {
      if (this.data.grad_year == null) {
        return null;
      }
      return this.data.grad_year >= 1998 && this.data.grad_year < 2100;
    },
    phoneNumber() {
      return this.phoneString == null || this.phoneString.match(/\d+/g) == null
        ? null
        : this.phoneString.match(/\d+/g).join("");
    },
  },
  created() {
    this.newEntry = this.id == null;
    if (this.$store.state.authTier >= AUTH_TIERS.OFFICER) {
      axios
        .get(API_URL + "read_pledge_classes.php", {
          headers: { Authorization: this.$store.state.jwt },
        })
        .then((response) => {
          this.pledgeClasses = response.data.body.map((a) => a.class_name);
          this.getInfo();
        })
        .catch((error) =>
          this.$root.$children[0].showError(error.response.statusText)
        );
    } else {
      this.getInfo();
    }
  },
  data() {
    return {
      AUTH_TIERS: AUTH_TIERS,
      COUNTRY_LIST: COUNTRY_LIST,
      US_STATE_LIST: US_STATE_LIST,
      defaultData: {
        id: null,
        is_pledge: null,
        name_first: null,
        nume_middle: null,
        name_last: null,
        grad_year: null,
        nickname: null,
        majors: [null],
        hometown: null,
        home_state: null,
        home_country: null,
        emails: [null],
        phone_number: null,
        big: null,
        big_name: null,
        pledge_class: null,
        roll_number: null,
        brother_status: null,
        photo: null,
      },
      data: null,
      bigs: [],
      newBig: null,
      newState: null,
      newBrotherStatus: null,
      earlyAlumSemester: null,
      earlyAlumYear: null,
      pledgeClasses: null,
      statusOptions: [
        { value: "active", text: "Active" },
        { value: "inactive", text: "Inactive" },
        { value: "early alum", text: "Early alum" },
        { value: "alumni", text: "Alumni" },
      ],
      phoneString: null,
      newEntry: false,
      created: false,
      showPhotoModal: false,
      photo: null,
      response: null,
      loaded: false,
      bigsLoaded: false,
      bigsError: null,
      state1: null,
      state2: null,
    };
  },
  methods: {
    getInfo() {
      if (!this.newEntry) {
        axios
          .get(API_URL + "read_student.php?id=" + this.id, {
            headers: { Authorization: this.$store.state.jwt },
          })
          .then((response) => {
            this.data = response.data;
            this.newState =
              this.data.home_state == null
                ? null
                : US_STATE_LIST.find(
                    (x) => x.abbreviation == this.data.home_state
                  );
            this.newBrotherStatus = this.data.brother_status;
            this.phoneString = this.formatPhone(this.data.phone_number);
            this.loaded = true;
          })
          .catch((error) =>
            this.$root.$children[0].showError(error.response.statusText)
          );
      } else {
        this.data = JSON.parse(JSON.stringify(this.defaultData));
        this.loaded = true;
      }
    },
    show() {
      this.showPhotoModal = true;
    },
    updateState1() {
      this.state1 = this.phoneNumberIsValid;
    },
    updateState2() {
      this.state2 = this.gradYearIsValid;
    },
    updatePhoto(photo) {
      this.data.photo = photo;
      this.showPhotoModal = false;
    },
    onSubmit() {
      if (this.checkData()) {
        this.sendData();
      }
    },
    checkData() {
      if (this.data.is_pledge == 0 && this.data.roll_number <= 0) {
        this.$root.$children[0].showError(
          "Roll number must be greater than 0."
        );
        return false;
      } else if (
        this.data.is_pledge == 0 &&
        this.data.big_roll_number != null &&
        parseInt(this.data.roll_number) <= parseInt(this.data.big_roll_number)
      ) {
        this.$root.$children[0].showError(
          "Changes cannot be saved. Big's roll number must be lower than student's roll number."
        );
        return false;
      } else if (
        this.newlyEarlyAlum &&
        (this.earlyAlumYear > this.data.grad_year || this.earlyAlumYear < 1998)
      ) {
        this.$root.$children[0].showError(
          "Year in which brother went early alum cannot be earlier than 1998 or later than brother's graduation year."
        );
      } else {
        return true;
      }
    },
    sendData() {
      this.data.early_alum_semester = this.newlyEarlyAlum
        ? this.earlyAlumSemester
        : null;
      this.data.early_alum_year = this.newlyEarlyAlum
        ? this.earlyAlumYear
        : null;
      this.data.home_state =
        this.newState == null ||
        this.data.home_country != "United States of America"
          ? null
          : this.newState.abbreviation;
      this.data.phone_number = this.phoneNumber;
      this.data.brother_status = this.newBrotherStatus;
      let apiCall = this.newEntry
        ? "create_student.php"
        : "update_student.php?id=" + this.data.id;
      axios
        .post(API_URL + apiCall, this.data, {
          headers: { Authorization: this.$store.state.jwt },
        })
        .then((response) => {
          if (this.newEntry) {
            this.response = response.data.message;
            this.created = true;
            this.data.id = response.data.id;
          } else {
            this.$root.$children[0].showSuccess(response.data.message);
            this.$router.push("/student/" + this.data.id, () => {});
          }
        })
        .catch((error) => {
          this.$root.$children[0].showError(error.response.statusText);
        });
    },
    loadBigs() {
      axios
        .get(API_URL + "read_brother_names.php", {
          headers: { Authorization: this.$store.state.jwt },
        })
        .then((response) => {
          this.bigs = response.data.body;
          this.newBig =
            this.data.big == null
              ? null
              : this.bigs.find((x) => x.id == this.data.big);
          this.bigsLoaded = true;
        })
        .catch((error) => (this.bigsError = error.response.statusText));
    },
    getCustomDescriptionBig(option) {
      return option.roll_number + " " + option.full_name;
    },
    getCustomDescriptionState(option) {
      return option.name;
    },
    changeBig() {
      this.bigsLoaded = false;
      if (this.newBig != null) {
        if (
          this.data.roll_number == null ||
          parseInt(this.data.roll_number) >= parseInt(this.newBig.roll_number)
        ) {
          this.data.big = this.newBig.id;
          this.data.big_name = this.newBig.full_name;
          this.data.big_roll_number = this.newBig.roll_number;
        } else {
          this.$root.$children[0].showError(
            "Cannot change big to " +
              this.newBig.full_name +
              ". Big's roll number must be lower than student's roll number."
          );
        }
      } else {
        this.data.big = null;
        this.data.big_name = null;
      }
    },
    addMajor() {
      this.data.majors.push(null);
    },
    updateMajor(index, majorReturned) {
      this.data.majors[index] = majorReturned;
    },
    deleteMajor(index) {
      this.data.majors.splice(index, 1);
    },
    addEmail() {
      this.data.emails.push(null);
    },
    deleteEmail(index) {
      this.data.emails.splice(index, 1);
    },
    formatPhone(numberString) {
      return (
        "(" +
        numberString.substring(0, 3) +
        ") " +
        numberString.substring(3, 6) +
        "-" +
        numberString.substring(6)
      );
    },
    reset() {
      this.data = JSON.parse(JSON.stringify(this.defaultData));
      this.newBrotherStatus = null;
      this.phoneString = null;
      this.state1 = null;
      this.state2 = null;
      this.created = false;
    },
    viewCreated() {
      this.$router.push("/student/" + this.data.id, () => {});
    },
  },
};
</script>

<style scoped>
h3 {
  border-radius: 10px;
  background-color: var(--ot-off-white);
  padding-top: 10px;
  padding-bottom: 10px;
  margin-top: 30px;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
.profile-photo {
  margin: auto;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
#show {
  cursor: pointer;
}
#newly-early-alum {
  padding: 10px;
  border-radius: 10px;
  background-color: var(--ot-gold);
}
#newly-early-alum-fields {
  display: flex;
  gap: 10px;
}
.selection-button {
  margin: 10px;
}
#buttons,
#created {
  text-align: center;
}
.position-sticky {
  padding: 20px;
  text-align: center;
  background-color: var(--ot-off-white);
  bottom: 20px;
  z-index: 10;
  margin-top: 20px;
  border-radius: 10px;
  box-shadow: 0 0 20px 10px white, 0 0 30px 5px white;
}
.position-sticky button {
  width: 100%;
}
</style>
