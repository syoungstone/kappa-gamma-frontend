<template>
  <div>
    <b-modal
      id="edit-choice-modal"
      title="Repeat Event"
      v-model="showEditChoiceModal"
    >
      <p>
        This is a repeat event. Would you like your changes to apply to this
        event only, this and following events, or all events in this sequence?
      </p>
      <template #modal-footer="{ cancel }">
        <b-button class="sequence-button" @click="cancel()"> Cancel </b-button>
        <b-button class="sequence-button" variant="primary" @click="editThis()">
          Apply To This Event Only
        </b-button>
        <b-button
          class="sequence-button"
          variant="warning"
          @click="editFollowing()"
        >
          Apply To This And Following Events
        </b-button>
        <b-button class="sequence-button" variant="danger" @click="editAll()">
          Apply To All Events In Sequence
        </b-button>
      </template>
    </b-modal>
    <b-form @submit.prevent="onSubmit">
      <h1>{{ editing ? "Edit Event" : "Create New Event" }}</h1>

      <b-form-group id="input-group-name" label="Name:" label-for="input-name">
        <b-input
          id="input-name"
          v-model="event.title"
          :disabled="event.is_chapter_meeting == 1"
          required
        ></b-input>
      </b-form-group>

      <div id="checkboxes">
        <b-form-group v-if="$store.state.authTier >= AUTH_TIERS.OFFICER">
          <b-form-checkbox
            id="checkbox-meeting"
            v-model="event.is_chapter_meeting"
            :value="1"
            :unchecked-value="0"
            @input="isChapterMeetingChanged"
          >
            Chapter meeting
          </b-form-checkbox>
        </b-form-group>

        <b-form-group>
          <b-form-checkbox
            v-if="event.is_chapter_meeting == 0"
            id="checkbox-allday"
            v-model="event.allDay"
            :value="1"
            :unchecked-value="0"
          >
            All day event
          </b-form-checkbox>
        </b-form-group>

        <b-form-group v-if="!editing">
          <b-form-checkbox id="checkbox-repeats" v-model="event.repeats">
            Repeats
          </b-form-checkbox>
        </b-form-group>
      </div>

      <div id="repeat-form" v-if="!editing && event.repeats">
        <b-form-group label="Frequency:" label-for="select-frequency">
          <b-form-select
            id="select-frequency"
            v-model="event.repeat_frequency"
            :options="frequencyOptions"
            required
          >
          </b-form-select>
        </b-form-group>

        <b-form-group label="Until:" label-for="datepicker-until">
          <b-form-datepicker
            id="datepicker-until"
            v-model="event.repeat_until"
            :date-format-options="{
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
            }"
            required
          >
          </b-form-datepicker>
        </b-form-group>
      </div>

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
        v-if="event.is_chapter_meeting == 0"
        id="select-group-committee"
        :label="
          'Sponsoring committee' +
          ($store.state.authTier >= AUTH_TIERS.OFFICER ? ' (optional):' : ':')
        "
        label-for="select-committee"
      >
        <b-form-select
          id="select-committee"
          v-model="event.committee"
          :options="committeeOptions"
          :required="$store.state.authTier < AUTH_TIERS.OFFICER"
          value-field="line_item_id"
          text-field="line_item_name"
        ></b-form-select>
      </b-form-group>

      <b-form-group
        v-if="event.is_chapter_meeting == 0"
        label="Description:"
        label-for="textarea-description"
      >
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
        label="Visibility:"
        label-for="select-visibility"
      >
        <b-form-select
          id="select-visibility"
          v-model="visibility"
          :options="visibilityOptions"
          :disabled="event.is_chapter_meeting == 1"
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
      <div v-if="$store.state.authTier >= AUTH_TIERS.BROTHER">
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
  </div>
</template>

<script>
import axios from "axios";
import { AUTH_TIERS, API_URL } from "../constants/index.js";
export default {
  name: "StudentForm",
  props: ["eventData"],
  data() {
    return {
      AUTH_TIERS: AUTH_TIERS,
      editing: false,
      showEditChoiceModal: false,
      editAllFollowing: false,
      editAllInSequence: false,
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
      frequencyOptions: [
        { value: "day", text: "Daily" },
        { value: "week", text: "Weekly" },
        { value: "month", text: "Monthly" },
      ],
      altPledgeName: false,
      event: null,
    };
  },
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
  watch: {
    startDate: function (newStartDate, oldStartDate) {
      if (this.endDate == null || this.endDate == oldStartDate) {
        this.endDate = newStartDate;
      }
    },
  },
  methods: {
    getCommitteeOptions() {
      if (this.$store.state.authTier < AUTH_TIERS.OFFICER) {
        this.committeeOptions = this.$store.state.committees;
      } else {
        axios
          .get(API_URL + "read_committee_names.php", {
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
      if (this.editing && this.event.repeat_id != null) {
        this.showEditChoiceModal = true;
      } else {
        this.sendData();
      }
    },
    editThis() {
      this.editAllFollowing = false;
      this.editAllInSequence = false;
      this.showEditChoiceModal = false;
      this.sendData();
    },
    editFollowing() {
      this.editAllFollowing = true;
      this.editAllInSequence = false;
      this.showEditChoiceModal = false;
      this.sendData();
    },
    editAll() {
      this.editAllFollowing = false;
      this.editAllInSequence = true;
      this.showEditChoiceModal = false;
      this.sendData();
    },
    sendData() {
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
      } else if (this.event.repeats && this.event.repeat_until == null) {
        let modalTitle = "Until Date Not Selected";
        let modalMessage = "Repeating events must include an 'Until' date.";
        this.$root.$children[0].showMessage(modalTitle, modalMessage);
      } else if (
        this.event.repeats &&
        this.event.repeat_until < this.startDate
      ) {
        let modalTitle = "Date Mismatch";
        let modalMessage =
          "The date given for your event to repeat until cannot come before the start date.";
        this.$root.$children[0].showMessage(modalTitle, modalMessage);
      } else {
        this.event.is_public = this.visibility == "public" ? 1 : 0;
        this.event.is_for_pledges = this.visibility == "pledges" ? 1 : 0;
        let apiCall;
        if (this.editing) {
          apiCall =
            "update_event.php" +
            (this.editAllFollowing ? "?following=true" : "") +
            (this.editAllInSequence ? "?all=true" : "");
        } else {
          apiCall = "create_event.php";
        }
        axios
          .post(API_URL + apiCall, this.event, {
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
        is_chapter_meeting: 0,
        event_description: null,
        event_location: null,
        start: null,
        end: null,
        allDay: 0,
        repeats: false,
        repeat_frequency: "week",
        repeat_until: null,
        committee: null,
        is_public: null,
        is_for_pledges: null,
        alt_pledge_name: null,
        repeat_id: null,
      };
    },
    isChapterMeetingChanged() {
      if (this.event.is_chapter_meeting == 1) {
        this.event.title = "Chapter Meeting";
        this.visibility = "brothers";
        this.event.committee = null;
        this.event.event_description = null;
        this.event.allDay = 0;
      } else {
        this.event.title = null;
        this.visibility = null;
      }
    },
  },
};
</script>

<style scoped>
#checkboxes {
  display: flex;
  gap: 20px;
}
#repeat-form {
  border-radius: 10px;
  padding-top: 10px;
  padding-left: 15px;
  margin-bottom: 15px;
  display: flex;
  gap: 20px;
  background-color: var(--ot-off-white);
}
.sequence-button {
  width: 100%;
}
.submit-button {
  margin-right: 10px;
}
</style>
