<template>
  <b-form @submit.prevent="onSubmit">
    <h1>{{ editing ? "Edit Event" : "Create New Event" }}</h1>

    <b-form-group id="input-group-name" label="Name:" label-for="input-name">
      <b-input id="input-name" v-model="event.event_name" required></b-input>
    </b-form-group>

    <b-form-group label="From:" label-for="from">
      <b-input-group id="from">
        <b-form-datepicker
          v-model="fromDate"
          :date-format-options="{
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
          }"
          required
        ></b-form-datepicker>
        <b-form-timepicker
          v-model="fromTime"
          locale="en"
          no-close-button
          required
        ></b-form-timepicker>
      </b-input-group>
    </b-form-group>

    <b-form-group label="To:" label-for="to">
      <b-input-group id="to">
        <b-form-datepicker
          v-model="toDate"
          :date-format-options="{
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
          }"
          required
        ></b-form-datepicker>
        <b-form-timepicker
          v-model="toTime"
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
      let from = this.event.from_datetime.split(" ");
      let to = this.event.to_datetime.split(" ");
      this.fromDate = from[0];
      this.fromTime = from[1];
      this.toDate = to[0];
      this.toTime = to[1];
    }
  },
  data() {
    return {
      editing: false,
      fromDate: null,
      fromTime: null,
      toDate: null,
      toTime: null,
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
        !this.fromDate ||
        !this.fromTime ||
        !this.toDate ||
        !this.toTime ||
        !this.event.event_name
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
            this.$root.$children[0].showError(error);
          });
      }
    },
    cancel() {
      this.$emit("goback");
    },
    onSubmit() {
      this.event.from_datetime = this.fromDate + " " + this.fromTime;
      this.event.to_datetime = this.toDate + " " + this.toTime;

      if (this.event.from_datetime > this.event.to_datetime) {
        let modalTitle = "Invalid Start & End Times";
        let modalMessage =
          "The time at which your event starts must be before the time at which it ends.";
        this.$root.$children[0].showMessage(modalTitle, modalMessage);
      } else {
        this.event.is_public = this.visibility == "public" ? 1 : 0;
        this.event.is_for_pledges = this.visibility == "pledges" ? 1 : 0;
        let apiCall = this.editing ? "update_event.php" : "create_event.php";
        console.log(this.event);
        axios
          .post(this.$store.state.apiURL + apiCall, this.event, {
            headers: { Authorization: this.$store.state.jwt },
          })
          .then((response) => {
            if (response.data.success) {
              this.$root.$children[0].showSuccess(response.data.message);
              if (this.editing) {
                this.$emit("goback");
              } else {
                this.resetEvent();
              }
            } else {
              this.$root.$children[0].showError(response.data.error);
            }
          })
          .catch(() => {
            this.$root.$children[0].showError(
              "Event could not be " + this.editing ? "updated." : "created."
            );
          });
      }
    },
    resetEvent() {
      this.fromDate = null;
      this.fromTime = null;
      this.toDate = null;
      this.toTime = null;
      this.visibility = null;
      this.event = {
        id: null,
        event_name: null,
        event_description: null,
        event_location: null,
        from_datetime: null,
        to_datetime: null,
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
