<template>
  <div id="everything">
    <b-form @submit="onSubmit" v-if="loaded">
      <div v-if="data.photo" class="thumbnail">
        <img :src="data.photo" alt="Profile photo" />
      </div>
      <div v-else-if="data.is_pledge != 1" class="thumbnail">
        <img src="../assets/nophoto.jpg" alt="Photo placeholder" />
      </div>
      <h1>
        {{ data.name_first + " " }}
        {{ data.name_middle ? data.name_middle + " " : "" }}
        {{ data.name_last }}
      </h1>

      <b-form-group id="input-group-2" label="Major:" label-for="input-2">
        <b-form-input id="input-2" v-model="data.major" required></b-form-input>
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
          @change="updateState2()"
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
        id="input-group-5"
        label="Home State:"
        label-for="input-5"
        invalid-feedback="State must be represented by two uppercase letters, e.g. 'VA'."
        :state="state3"
      >
        <b-form-input
          id="input-5"
          v-model="data.home_state"
          :state="state3"
          @change="updateState3()"
        ></b-form-input>
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
          :required="true"
        ></vue-single-select>
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
          v-model="data.phone_number"
          type="tel"
          :state="state1"
          required
          @change="updateState1()"
        ></b-form-input>
      </b-form-group>

      <b-button type="submit" variant="primary" :disabled="submitDisabled"
        >Save Changes</b-button
      >
    </b-form>
    <div v-else id="loading">
      <b-spinner style="width: 3rem; height: 3rem" variant="primary"
        >Loading...</b-spinner
      >
    </div>
    <div v-if="error" class="mt-3">
      <strong>{{ error }}</strong>
    </div>
    <div v-if="response" class="mt-3">
      <strong>{{ response }}</strong>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  computed: {
    submitDisabled() {
      return !(
        (this.state1 || this.state1 == null) &&
        (this.state2 || this.state2 == null) &&
        (this.state3 || this.state3 == null)
      );
    },
  },
  created() {
    axios
      .get(process.env.VUE_APP_API + "read_current_student.php", {
        headers: { Authorization: this.$store.state.jwt },
      })
      .then((response) => {
        this.data = response.data;
        this.loaded = true;
      })
      .catch((error) => (this.error = error));
  },
  data() {
    return {
      selected: null,
      data: {},
      countryList: [
        "Afghanistan",
        "Åland Islands",
        "Albania",
        "Algeria",
        "American Samoa",
        "Andorra",
        "Angola",
        "Anguilla",
        "Antarctica",
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
        "United States of America",
        "Uruguay",
        "Uzbekistan",
        "Vanuatu",
        "Venezuela",
        "Viet Nam",
        "Virgin Islands (U.K.)",
        "Virgin Islands (U.S.)",
        "Wallis and Futuna",
        "Western Sahara",
        "Yemen",
        "Zambia",
        "Zimbabwe",
      ],
      response: null,
      error: null,
      loaded: false,
      state1: null,
      state2: null,
      state3: null,
    };
  },
  methods: {
    onSubmit() {
      axios
        .post(
          process.env.VUE_APP_API + "update_current_student.php",
          this.data,
          {
            headers: { Authorization: this.$store.state.jwt },
          }
        )
        .then((response) => {
          this.response = response.data;
        })
        .catch((error) => (this.error = error));
    },
    updateState1() {
      const regex = new RegExp("[0-9]{10}");
      this.state1 =
        regex.test(this.data.phone_number) &&
        this.data.phone_number.length == 10;
    },
    updateState2() {
      this.state2 = this.data.grad_year >= 1998 && this.data.grad_year < 2100;
    },
    updateState3() {
      const regex = new RegExp("[A-Z]{2}");
      this.state3 =
        (regex.test(this.data.home_state) &&
          this.data.home_state.length == 2) ||
        this.data.home_state.length == 0;
    },
  },
};
</script>

<style>
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
</style>
