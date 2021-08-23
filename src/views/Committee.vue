<template>
  <div class="wide-wrapper">
    <div v-if="loaded">
      <h1>{{ committee.committee_name + " Committee" }}</h1>
      <b-list-group id="data" :horizontal="width > 480">
        <b-list-group-item
          ><strong>Budget: </strong>
          {{ "$" + committee.amount_budgeted.toFixed(2) }}</b-list-group-item
        >
        <b-list-group-item
          ><strong>Spent: </strong
          >{{ "$" + committee.amount_spent.toFixed(2) }}</b-list-group-item
        >
        <b-list-group-item
          ><strong>Collected: </strong
          >{{ "$" + committee.amount_collected.toFixed(2) }}</b-list-group-item
        >
        <b-list-group-item
          ><strong>Balance: </strong>
          <span :class="isNegative ? 'negative' : ''">
            {{ balanceString }}
          </span></b-list-group-item
        >
      </b-list-group>
      <h4>
        <strong>Chair: </strong
        ><router-link
          v-if="committee.chair_name"
          :to="'/student/' + committee.chair_id"
          >{{ committee.chair_name }}</router-link
        >
        <div v-else>VACANT</div>
      </h4>
      <b-card no-body>
        <b-tabs card>
          <b-tab title="Members" active>
            <ul v-if="committee.members.length > 0">
              <li v-for="member in committee.members" :key="member.member_id">
                <router-link :to="'/student/' + member.member_id">{{
                  member.member_name
                }}</router-link>
              </li>
            </ul>
            <p v-else>No members assigned to this committee.</p>
          </b-tab>
          <b-tab title="Financial">
            <b-card-text>
              <b-table
                :items="committee.financial"
                :fields="fields"
                striped
                show-empty
                responsive="sm"
              >
                <template #cell(us_date)="row">
                  {{
                    row.item.date.substring(5, 7) +
                    "/" +
                    row.item.date.substring(8) +
                    "/" +
                    row.item.date.substring(2, 4)
                  }}
                </template>
                <template #cell(type)="row">
                  {{
                    row.item.record_type.charAt(0).toUpperCase() +
                    row.item.record_type.slice(1)
                  }}
                </template>
                <template #cell(amount_formatted)="row">
                  <div
                    :class="row.item.record_type == 'expense' ? 'negative' : ''"
                  >
                    {{
                      row.item.record_type == "expense"
                        ? "($" + row.item.amount + ")"
                        : "$" + row.item.amount
                    }}
                  </div>
                </template>
              </b-table></b-card-text
            >
          </b-tab>
          <b-tab title="Upcoming Events">
            <EventList
              :eventList="committee.upcoming_events"
              @event-selected="eventSelected"
            />
          </b-tab>
          <b-tab title="Past Events">
            <EventList
              :eventList="committee.past_events"
              @event-selected="eventSelected"
            />
          </b-tab>
        </b-tabs>
      </b-card>
    </div>
    <LoadingSpinner v-else />
  </div>
</template>

<script>
import axios from "axios";
import { AUTH_TIERS, API_URL } from "../constants/index.js";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import EventList from "@/components/EventList.vue";
export default {
  components: {
    LoadingSpinner,
    EventList,
  },
  created() {
    axios
      .get(API_URL + "read_committee.php?id=" + this.$route.params.id, {
        headers: { Authorization: this.$store.state.jwt },
      })
      .then((response) => {
        this.committee = response.data;
        this.loaded = true;
      })
      .catch((error) => {
        this.$root.$children[0].showError(error.response.statusText);
        if (error.response.status == 404) {
          this.$router.push("/404", () => {});
        }
      });
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener("resize", this.setWidth);
    });
    this.setWidth();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.setWidth);
  },
  data() {
    return {
      fields: [
        { key: "us_date", label: "Date" },
        { key: "type" },
        { key: "reason" },
        { key: "amount_formatted", label: "Amount" },
      ],
      AUTH_TIERS: AUTH_TIERS,
      width: null,
      committee: null,
      loaded: false,
    };
  },
  computed: {
    isNegative() {
      return (
        this.committee.amount_budgeted +
          this.committee.amount_collected -
          this.committee.amount_spent <
        0
      );
    },
    balanceString() {
      let amount =
        this.committee.amount_budgeted +
        this.committee.amount_collected -
        this.committee.amount_spent;
      let amountString = "$" + Math.abs(amount).toFixed(2);
      if (amount < 0) {
        amountString = "(" + amountString + ")";
      }
      return amountString;
    },
  },
  methods: {
    setWidth() {
      this.width = window.innerWidth;
    },
    editCommittees() {
      this.$router.push("/updatecommittees", () => {});
    },
    eventSelected(id) {
      this.$router.push("/event/" + id, () => {});
    },
  },
};
</script>

<style scoped>
h1,
h4 {
  margin-bottom: 20px;
}
h4 {
  margin-top: 20px;
}
#data {
  justify-content: center;
}
.card {
  background-color: white !important;
  box-shadow: none;
}
#name-row {
  justify-content: center;
}
.negative {
  color: red;
}
</style>
