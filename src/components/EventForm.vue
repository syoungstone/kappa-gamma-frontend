<template>
  <b-form @submit.prevent="onSubmit">
    <h1>{{ editing ? "Edit Event" : "Create New Event" }}</h1>

    <b-form-group id="input-group-name" label="Name:" label-for="input-name">
      <b-input id="input-name" v-model="event.title" required></b-input>
    </b-form-group>

    <b-form-group>
      <b-form-checkbox
        id="checkbox-allday"
        v-model="event.allDay"
        :value="1"
        :unchecked-value="0"
      >
        All day event
      </b-form-checkbox>
    </b-form-group>

    <b-form-group label="Start:" label-for="start">
      <b-input-group id="start">
        <b-form-datepicker
          v-model="startDate"
          :date-format-options="{
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
          }"
          required
        ></b-form-datepicker>
        <b-form-timepicker
          v-if="event.allDay != 1"
          v-model="startTime"
          locale="en"
          no-close-button
          required
        ></b-form-timepicker>
      </b-input-group>
    </b-form-group>

    <b-form-group label="End:" label-for="end">
      <b-input-group id="end">
        <b-form-datepicker
          v-model="endDate"
          :date-format-options="{
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
          }"
          required
        ></b-form-datepicker>
        <b-form-timepicker
          v-if="event.allDay != 1"
          v-model="endTime"
          locale="en"
          no-close-button
          required
        ></b-form-timepicker>
      </b-input-group>
    </b-form-group>

    <b-form-group
      id="input-group-location"
      label="Location:"
      label-for="input-location"
    >
      <b-input
        id="input-location"
        v-model="event.event_location"
        required
      ></b-input>
    </b-form-group>

    <b-form-group
      id="select-group-committee"
      label="Sponsoring committee (optional):"
      label-for="select-committee"
    >
      <b-form-select
        id="select-committee"
        v-model="event.committee"
        :options="committeeOptions"
      ></b-form-select>
    </b-form-group>

    <b-form-group label="Description:" label-for="textarea-description">
      <b-form-textarea
        id="textarea-description"
        rows="3"
        no-resize
        placeholder="If this event is open to pledges or the general public, they will be able to read this too!"
        v-model="event.event_description"
      ></b-form-textarea>
    </b-form-group>

    <b-form-group
      id="select-group-visibility"
      label="Visbility:"
      label-for="select-visibility"
    >
      <b-form-select
        id="select-visibility"
        v-model="visibility"
        :options="visibilityOptions"
        required
      ></b-form-select>
    </b-form-group>

    <b-form-group>
      <b-form-checkbox
        v-if="visibility == 'pledges'"
        id="checkbox-alt-name"
        v-model="altPledgeName"
      >
        Display an alternate name for pledges
      </b-form-checkbox>
    </b-form-group>

    <b-form-group
      v-if="altPledgeName"
      id="input-group-alt-name"
      label="Alternate name for pledges:"
      label-for="input-alt-name"
    >
      <b-input
        id="input-alt-name"
        v-model="event.alt_pledge_name"
        required
      ></b-input>
    </b-form-group>
    <div v-if="$store.state.isBrother">
      <b-button class="submit-button" v-if="editing" @click="cancel()"
        >Cancel</b-button
      >
      <b-button
        class="submit-button"
        type="submit"
        variant="primary"
        :disabled="submitDisabled"
        >Submit</b-button
      >
    </div>
  </b-form>
</template>

<script>
import axios from "axios";
export default {
  name: "StudentForm",
  props: ["eventData"],
  created() {
    this.resetEvent();
    this.getCommitteeOptions();
    this.editing = this.eventData != null;
    if (this.editing) {
      this.event = this.eventData;
      this.visibility = this.event.is_public
        ? "public"
        : this.event.is_for_pledges
        ? "pledges"
        : "brothers";
      this.altPledgeName = this.event.alt_pledge_name != null;
      let from = this.event.start.split(" ");
      let to = this.event.end.split(" ");
      this.startDate = from[0];
      this.startTime = from[1];
      this.endDate = to[0];
      this.endTime = to[1];
    }
  },
  data() {
    return {
      editing: false,
      startDate: null,
      startTime: null,
      endDate: null,
      endTime: null,
      committeeOptions: null,
      visibility: null,
      visibilityOptions: [
        { value: "public", text: "Public" },
        { value: "pledges", text: "Brothers & pledges" },
        { value: "brothers", text: "Brothers only" },
      ],
      altPledgeName: false,
      event: null,
    };
  },
  computed: {
    submitDisabled() {
      return (
        !this.startDate ||
        (!this.startTime && this.event.allDay != 1) ||
        !this.endDate ||
        (!this.endTime && this.event.allDay != 1) ||
        !this.event.title
      );
    },
  },
  methods: {
    getCommitteeOptions() {
      if (this.$store.state.position == null) {
        this.committeeOptions = this.$store.state.committees;
      } else {
        axios
          .get(this.$store.state.apiURL + "read_committees.php", {
            headers: { Authorization: this.$store.state.jwt },
          })
          .then((response) => {
            this.committeeOptions = response.data.body;
          })
          .catch((error) => {
            this.$root.$children[0].showError(error.response.statusText);
          });
      }
    },
    cancel() {
      this.$emit("goback");
    },
    onSubmit() {
      this.event.start =
        this.startDate +
        "T" +
        (this.event.allDay == 1 ? "00:00:00" : this.startTime);
      this.event.end =
        (this.event.allDay == 1
          ? this.incrementDay(this.endDate)
          : this.endDate) +
        "T" +
        (this.event.allDay == 1 ? "00:00:00" : this.endTime);
      if (this.event.start >= this.event.end) {
        let modalTitle = "Invalid Start & End Times";
        let modalMessage =
          "The time at which your event starts must be before the time at which it ends.";
        this.$root.$children[0].showMessage(modalTitle, modalMessage);
      } else {
        this.event.is_public = this.visibility == "public" ? 1 : 0;
        this.event.is_for_pledges = this.visibility == "pledges" ? 1 : 0;
        let apiCall = this.editing ? "update_event.php" : "create_event.php";
        axios
          .post(this.$store.state.apiURL + apiCall, this.event, {
            headers: { Authorization: this.$store.state.jwt },
          })
          .then((response) => {
            this.$root.$children[0].showSuccess(response.data.message);
            if (!this.editing) {
              this.event.id = response.data.id;
            }
            this.$router.push("/event/" + this.event.id, () => {});
          })
          .catch((error) => {
            this.$root.$children[0].showError(error.response.statusText);
          });
      }
    },
    incrementDay(dateString) {
      let date = new Date(dateString + "T00:00:00");
      date.setDate(date.getDate() + 1);
      let month = "" + (date.getMonth() + 1),
        day = "" + date.getDate(),
        year = date.getFullYear();
      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;
      let returnString = [year, month, day].join("-");
      return returnString;
    },
    resetEvent() {
      this.startDate = null;
      this.startTime = null;
      this.endDate = null;
      this.endTime = null;
      this.visibility = null;
      this.event = {
        id: null,
        title: null,
        event_description: null,
        event_location: null,
        start: null,
        end: null,
        allDay: 0,
        committee: null,
        is_public: null,
        is_for_pledges: null,
        alt_pledge_name: null,
      };
    },
  },
};
</script>

<style scoped>
h3 {
  border-radius: 10px;
  background-color: var(--ot-gold);
  padding-top: 10px;
  padding-bottom: 10px;
  margin-top: 30px;
  margin-bottom: 20px;
}
.profile-photo {
  margin: auto;
  border: 3px solid black;
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
.submit-button {
  margin-right: 10px;
}
</style>
