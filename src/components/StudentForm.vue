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
          v-if="isBrother && $store.state.permissionTier >= AUTH_TIERS.OFFICER"
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

      <h3 v-if="$store.state.permissionTier >= AUTH_TIERS.OFFICER">
        Membership
      </h3>

      <b-form-group
        v-if="isBrother && $store.state.permissionTier >= AUTH_TIERS.OFFICER"
        id="select-group-0"
        label="Status:"
        label-for="select-0"
      >
        <b-form-select
          id="select-0"
          v-model="data.brother_status"
          :options="statusOptions"
          :required="
            isBrother && $store.state.permissionTier >= AUTH_TIERS.OFFICER
          "
        ></b-form-select>
      </b-form-group>

      <b-form-group
        v-if="isBrother && $store.state.permissionTier >= AUTH_TIERS.OFFICER"
        id="input-group-0"
        label="Roll Number:"
        label-for="input-0"
      >
        <b-form-input
          id="input-0"
          v-model="data.roll_number"
          type="number"
          :required="
            isBrother && $store.state.permissionTier >= AUTH_TIERS.OFFICER
          "
        ></b-form-input>
      </b-form-group>

      <b-form-group
        v-if="$store.state.permissionTier >= AUTH_TIERS.OFFICER"
        id="input-group-pledge-class"
        label="Pledge Class:"
        label-for="input-pledge-class"
      >
        <vue-single-select
          inputId="input-pledge-class"
          v-model="data.pledge_class"
          :options="pledgeClasses"
          :required="$store.state.permissionTier >= AUTH_TIERS.OFFICER"
        ></vue-single-select>
      </b-form-group>

      <b-form-group
        v-if="$store.state.permissionTier >= AUTH_TIERS.OFFICER"
        id="input-group-d"
        label="Nickname:"
        label-for="input-d"
      >
        <b-form-input id="input-d" v-model="data.nickname"></b-form-input>
      </b-form-group>

      <b-form-group
        v-if="$store.state.permissionTier >= AUTH_TIERS.OFFICER"
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
        v-if="$store.state.permissionTier >= AUTH_TIERS.OFFICER"
        id="input-group-a"
        label="First Name:"
        label-for="input-a"
      >
        <b-form-input
          id="input-a"
          v-model="data.name_first"
          :required="$store.state.permissionTier >= AUTH_TIERS.OFFICER"
        ></b-form-input>
      </b-form-group>

      <b-form-group
        v-if="$store.state.permissionTier >= AUTH_TIERS.OFFICER"
        id="input-group-b"
        label="Middle Name:"
        label-for="input-b"
      >
        <b-form-input id="input-b" v-model="data.name_middle"></b-form-input>
      </b-form-group>

      <b-form-group
        v-if="$store.state.permissionTier >= AUTH_TIERS.OFFICER"
        id="input-group-c"
        label="Last Name:"
        label-for="input-c"
      >
        <b-form-input
          id="input-c"
          v-model="data.name_last"
          :required="$store.state.permissionTier >= AUTH_TIERS.OFFICER"
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
          :options="stateList"
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
          :options="countryList"
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

      <b-button type="submit" variant="primary" :disabled="submitDisabled">{{
        newEntry
          ? "Create " + (data.is_pledge ? "Pledge" : "Brother")
          : "Save Changes"
      }}</b-button>
    </b-form>
    <LoadingSpinner v-else />
  </div>
</template>

<script>
import axios from "axios";
import { AUTH_TIERS, API_URL } from "../constants/index.js";
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
    if (this.$store.state.permissionTier >= AUTH_TIERS.OFFICER) {
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
      countryList: [
        "United States of America",
        "Afghanistan",
        "Åland Islands",
        "Albania",
        "Algeria",
        "American Samoa",
        "Andorra",
        "Angola",
        "Anguilla",
        "Antigua and Barbuda",
        "Argentina",
        "Armenia",
        "Aruba",
        "Australia",
        "Austria",
        "Azerbaijan",
        "Bahamas",
        "Bahrain",
        "Bangladesh",
        "Barbados",
        "Belarus",
        "Belgium",
        "Belize",
        "Benin",
        "Bermuda",
        "Bhutan",
        "Bolivia",
        "Bonaire, Sint Eustatius and Saba",
        "Bosnia and Herzegovina",
        "Botswana",
        "Bouvet Island",
        "Brazil",
        "British Indian Ocean Territory",
        "Brunei Darussalam",
        "Bulgaria",
        "Burkina Faso",
        "Burundi",
        "Cabo Verde",
        "Cambodia",
        "Cameroon",
        "Canada",
        "Cayman Islands",
        "Central African Republic",
        "Chad",
        "Chile",
        "China",
        "Christmas Island",
        "Cocos Islands",
        "Colombia",
        "Comoros",
        "Democratic Republic of the Congo",
        "Republic of the Congo",
        "Cook Islands",
        "Costa Rica",
        "Croatia",
        "Cuba",
        "Curaçao",
        "Cyprus",
        "Czechia",
        "Côte d'Ivoire",
        "Denmark",
        "Djibouti",
        "Dominica",
        "Dominican Republic",
        "Ecuador",
        "Egypt",
        "El Salvador",
        "Equatorial Guinea",
        "Eritrea",
        "Estonia",
        "Eswatini",
        "Ethiopia",
        "Falkland Islands [Malvinas]",
        "Faroe Islands",
        "Fiji",
        "Finland",
        "France",
        "French Guiana",
        "French Polynesia",
        "French Southern Territories",
        "Gabon",
        "Gambia",
        "Georgia",
        "Germany",
        "Ghana",
        "Gibraltar",
        "Greece",
        "Greenland",
        "Grenada",
        "Guadeloupe",
        "Guam",
        "Guatemala",
        "Guernsey",
        "Guinea",
        "Guinea-Bissau",
        "Guyana",
        "Haiti",
        "Heard Island and McDonald Islands",
        "Holy See",
        "Honduras",
        "Hong Kong",
        "Hungary",
        "Iceland",
        "India",
        "Indonesia",
        "Iran",
        "Iraq",
        "Ireland",
        "Isle of Man",
        "Israel",
        "Italy",
        "Jamaica",
        "Japan",
        "Jersey",
        "Jordan",
        "Kazakhstan",
        "Kenya",
        "Kiribati",
        "North Korea",
        "South Korea",
        "Kuwait",
        "Kyrgyzstan",
        "Lao People's Democratic Republic",
        "Latvia",
        "Lebanon",
        "Lesotho",
        "Liberia",
        "Libya",
        "Liechtenstein",
        "Lithuania",
        "Luxembourg",
        "Macao",
        "Madagascar",
        "Malawi",
        "Malaysia",
        "Maldives",
        "Mali",
        "Malta",
        "Marshall Islands",
        "Martinique",
        "Mauritania",
        "Mauritius",
        "Mayotte",
        "Mexico",
        "Federated States of Micronesia",
        "Moldova",
        "Monaco",
        "Mongolia",
        "Montenegro",
        "Montserrat",
        "Morocco",
        "Mozambique",
        "Myanmar",
        "Namibia",
        "Nauru",
        "Nepal",
        "Netherlands",
        "New Caledonia",
        "New Zealand",
        "Nicaragua",
        "Niger",
        "Nigeria",
        "Niue",
        "Norfolk Island",
        "Northern Mariana Islands",
        "Norway",
        "Oman",
        "Pakistan",
        "Palau",
        "Palestine, State of",
        "Panama",
        "Papua New Guinea",
        "Paraguay",
        "Peru",
        "Philippines",
        "Pitcairn",
        "Poland",
        "Portugal",
        "Puerto Rico",
        "Qatar",
        "Republic of North Macedonia",
        "Romania",
        "Russian Federation",
        "Rwanda",
        "Réunion",
        "Saint Barthélemy",
        "Saint Helena, Ascension and Tristan da Cunha",
        "Saint Kitts and Nevis",
        "Saint Lucia",
        "Saint Martin",
        "Saint Pierre and Miquelon",
        "Saint Vincent and the Grenadines",
        "Samoa",
        "San Marino",
        "Sao Tome and Principe",
        "Saudi Arabia",
        "Senegal",
        "Serbia",
        "Seychelles",
        "Sierra Leone",
        "Singapore",
        "Sint Maarten",
        "Slovakia",
        "Slovenia",
        "Solomon Islands",
        "Somalia",
        "South Africa",
        "South Georgia and the South Sandwich Islands",
        "South Sudan",
        "Spain",
        "Sri Lanka",
        "Sudan",
        "Suriname",
        "Svalbard and Jan Mayen",
        "Sweden",
        "Switzerland",
        "Syrian Arab Republic",
        "Taiwan",
        "Tajikistan",
        "Tanzania",
        "Thailand",
        "Timor-Leste",
        "Togo",
        "Tokelau",
        "Tonga",
        "Trinidad and Tobago",
        "Tunisia",
        "Turkey",
        "Turkmenistan",
        "Turks and Caicos Islands",
        "Tuvalu",
        "Uganda",
        "Ukraine",
        "United Arab Emirates",
        "United Kingdom",
        "Uruguay",
        "Uzbekistan",
        "Vanuatu",
        "Venezuela",
        "Vietnam",
        "Virgin Islands (U.K.)",
        "Virgin Islands (U.S.)",
        "Wallis and Futuna",
        "Western Sahara",
        "Yemen",
        "Zambia",
        "Zimbabwe",
      ],
      stateList: [
        { name: "Virginia", abbreviation: "VA" },
        { name: "Alabama", abbreviation: "AL" },
        { name: "Alaska", abbreviation: "AK" },
        { name: "American Samoa", abbreviation: "AS" },
        { name: "Arizona", abbreviation: "AZ" },
        { name: "Arkansas", abbreviation: "AR" },
        { name: "California", abbreviation: "CA" },
        { name: "Colorado", abbreviation: "CO" },
        { name: "Connecticut", abbreviation: "CT" },
        { name: "Delaware", abbreviation: "DE" },
        { name: "District of Columbia", abbreviation: "DC" },
        { name: "Federated States of Micronesia", abbreviation: "FM" },
        { name: "Florida", abbreviation: "FL" },
        { name: "Georgia", abbreviation: "GA" },
        { name: "Guam", abbreviation: "GU" },
        { name: "Hawaii", abbreviation: "HI" },
        { name: "Idaho", abbreviation: "ID" },
        { name: "Illinois", abbreviation: "IL" },
        { name: "Indiana", abbreviation: "IN" },
        { name: "Iowa", abbreviation: "IA" },
        { name: "Kansas", abbreviation: "KS" },
        { name: "Kentucky", abbreviation: "KY" },
        { name: "Louisiana", abbreviation: "LA" },
        { name: "Maine", abbreviation: "ME" },
        { name: "Marshall Islands", abbreviation: "MH" },
        { name: "Maryland", abbreviation: "MD" },
        { name: "Massachusetts", abbreviation: "MA" },
        { name: "Michigan", abbreviation: "MI" },
        { name: "Minnesota", abbreviation: "MN" },
        { name: "Mississippi", abbreviation: "MS" },
        { name: "Missouri", abbreviation: "MO" },
        { name: "Montana", abbreviation: "MT" },
        { name: "Nebraska", abbreviation: "NE" },
        { name: "Nevada", abbreviation: "NV" },
        { name: "New Hampshire", abbreviation: "NH" },
        { name: "New Jersey", abbreviation: "NJ" },
        { name: "New Mexico", abbreviation: "NM" },
        { name: "New York", abbreviation: "NY" },
        { name: "North Carolina", abbreviation: "NC" },
        { name: "North Dakota", abbreviation: "ND" },
        { name: "Northern Mariana Islands", abbreviation: "MP" },
        { name: "Ohio", abbreviation: "OH" },
        { name: "Oklahoma", abbreviation: "OK" },
        { name: "Oregon", abbreviation: "OR" },
        { name: "Palau", abbreviation: "PW" },
        { name: "Pennsylvania", abbreviation: "PA" },
        { name: "Puerto Rico", abbreviation: "PR" },
        { name: "Rhode Island", abbreviation: "RI" },
        { name: "South Carolina", abbreviation: "SC" },
        { name: "South Dakota", abbreviation: "SD" },
        { name: "Tennessee", abbreviation: "TN" },
        { name: "Texas", abbreviation: "TX" },
        { name: "Utah", abbreviation: "UT" },
        { name: "Vermont", abbreviation: "VT" },
        { name: "Virgin Islands", abbreviation: "VI" },
        { name: "Washington", abbreviation: "WA" },
        { name: "West Virginia", abbreviation: "WV" },
        { name: "Wisconsin", abbreviation: "WI" },
        { name: "Wyoming", abbreviation: "WY" },
      ],
      bigs: [],
      newBig: null,
      newState: null,
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
                : this.stateList.find(
                    (x) => x.abbreviation == this.data.home_state
                  );
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
      } else {
        return true;
      }
    },
    sendData() {
      this.data.home_state =
        this.newState == null ? null : this.newState.abbreviation;
      this.data.phone_number = this.phoneNumber;
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
.selection-button {
  margin: 10px;
}
#buttons,
#created {
  text-align: center;
}
</style>
