<template>
  <div>
    <div v-if="loaded">
      <b-modal
        id="delete-entry-modal"
        ref="modal"
        :title="
          toDelete != null
            ? 'Warning: Deleting ' + toDelete.entry_type
            : 'Warning'
        "
        @ok="deleteEntry()"
      >
        <p>
          Are you sure you want to delete this account entry? After an account
          entry is deleted, it cannot be retrieved.
        </p>
        <template #modal-footer="{ cancel, ok }">
          <b-button size="sm" @click="cancel()"> Cancel </b-button>
          <b-button size="sm" variant="danger" @click="ok()">
            Delete Anyway
          </b-button>
        </template>
      </b-modal>
      <h1>
        {{ ($store.state.id == id ? "My" : studentName) + " Account" }}
      </h1>
      <div id="balance-box">
        <h4 v-if="$store.state.authTier > AUTH_TIERS.PLEDGE && loaded">
          Account Balance:
          <div id="balance-amount" :class="balance_owed > 0 ? 'negative' : ''">
            {{ balanceString }}
          </div>
        </h4>
      </div>
      <b-table
        :items="account_entries"
        :fields="fields"
        striped
        show-empty
        responsive="sm"
      >
        <template #cell(us_date)="row">
          {{
            row.item.entry_date.substring(5, 7) +
            "/" +
            row.item.entry_date.substring(8) +
            "/" +
            row.item.entry_date.substring(2, 4)
          }}
        </template>
        <template #cell(entry_type)="row">
          <div>
            {{ row.item.entry_type }}
            <b-icon-question-circle
              class="icon"
              v-if="row.item.entry_type == 'Fine'"
              v-b-popover.hover.top="row.item.reason"
            ></b-icon-question-circle>
          </div>
        </template>
        <template #cell(amount_formatted)="row">
          <div :class="row.item.amount < 0 ? 'negative' : ''">
            {{
              row.item.amount >= 0
                ? "$" + Math.abs(row.item.amount).toFixed(2)
                : "($" + Math.abs(row.item.amount).toFixed(2) + ")"
            }}
          </div>
        </template>
        <template #cell(actions)="row">
          <div class="text-right">
            <b-button
              class="select-button"
              size="sm"
              variant="danger"
              @click="prepareDeletion(row.item)"
            >
              Delete
            </b-button>
          </div>
        </template>
      </b-table>
    </div>
    <LoadingSpinner v-else />
  </div>
</template>

<script>
import axios from "axios";
import { AUTH_TIERS, API_URL } from "../constants/index.js";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
export default {
  name: "AccountDisplay",
  props: {
    id: {
      required: true,
    },
  },
  components: {
    LoadingSpinner,
  },
  created() {
    if (this.$store.state.id == this.id) {
      this.loadBalance();
    } else {
      this.loadName();
    }
  },
  data() {
    return {
      AUTH_TIERS: AUTH_TIERS,
      balance_owed: 0,
      account_entries: null,
      loaded: false,
      studentName: null,
      toDelete: null,
    };
  },
  computed: {
    fields() {
      let fields = [
        { key: "us_date", label: "Date" },
        { key: "entry_type", label: "Type" },
        { key: "amount_formatted", label: "Amount" },
      ];
      if (this.$store.state.authTier >= AUTH_TIERS.FINANCIAL) {
        fields.push({ key: "actions", label: "" });
      }
      return fields;
    },
    balanceString() {
      let amountString = "$" + Math.abs(this.balance_owed).toFixed(2);
      if (this.balance_owed > 0) {
        amountString = "(" + amountString + ")";
      }
      return amountString;
    },
  },
  methods: {
    loadName() {
      axios
        .get(API_URL + "read_student.php?id=" + this.id, {
          headers: { Authorization: this.$store.state.jwt },
        })
        .then((response) => {
          let student = response.data;
          this.studentName = student.name_first + " " + student.name_last;
          if (this.studentName.slice(-1) == "s") {
            this.studentName = this.studentName + "'";
          } else {
            this.studentName = this.studentName + "'s";
          }
          this.loadBalance();
        })
        .catch((error) => {
          this.$root.$children[0].showError(error.response.statusText);
        });
    },
    loadBalance() {
      axios
        .get(API_URL + "read_balance_owed.php?id=" + this.id, {
          headers: { Authorization: this.$store.state.jwt },
        })
        .then((response) => {
          this.balance_owed = response.data;
          this.loadEntries();
        })
        .catch((error) => {
          this.$root.$children[0].showError(error.response.statusText);
        });
    },
    loadEntries() {
      axios
        .get(API_URL + "read_account_entries.php?id=" + this.id, {
          headers: { Authorization: this.$store.state.jwt },
        })
        .then((response) => {
          this.account_entries = response.data.body;
          this.loaded = true;
        })
        .catch((error) => {
          this.loaded = true;
          this.$root.$children[0].showError(error.response.statusText);
        });
    },
    prepareDeletion(entry) {
      this.toDelete = entry;
      this.$bvModal.show("delete-entry-modal");
    },
    deleteEntry() {
      axios
        .delete(
          API_URL +
            "delete_account_entry.php?type=" +
            this.toDelete.entry_type.toLowerCase() +
            "&id=" +
            this.toDelete.id,
          {
            headers: { Authorization: this.$store.state.jwt },
          }
        )
        .then((response) => {
          this.$root.$children[0].showSuccess(response.data.message);
          this.loadBalance();
        })
        .catch((error) => {
          this.$root.$children[0].showError(error.response.statusText);
        });
    },
  },
};
</script>

<style scoped>
.icon {
  color: darkgray;
}
#balance-box {
  background-color: var(--ot-off-white);
  border-radius: 10px;
  padding: 10px;
  max-width: 60%;
  margin: auto;
  margin-top: 20px;
  margin-bottom: 20px;
}
.negative {
  color: red;
}
</style>
