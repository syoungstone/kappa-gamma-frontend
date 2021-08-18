<template>
  <div class="wide-wrapper">
    <h1>Edit Committees</h1>
    <div v-if="loaded">
      <b-modal
        id="delete-committee-modal"
        ref="modal"
        title="Warning: Deleting Committee"
        @ok="deleteCommittee()"
      >
        <p>
          Are you sure you want to delete the
          {{ toDelete.committee_name }} committee? This will also delete all
          membership information associated with this committee.
        </p>
        <template #modal-footer="{ cancel, ok }">
          <b-button size="sm" @click="cancel()"> Cancel </b-button>
          <b-button size="sm" variant="danger" @click="ok()">
            Delete Anyway
          </b-button>
        </template>
      </b-modal>
      <div id="create-new">
        <h4>Add committee</h4>
        <b-form inline @submit.prevent="onSubmit" id="create-form">
          <vue-single-select
            v-if="!newCommittee.committee_name"
            class="line-item-select"
            v-model="newCommittee.line_item"
            :options="availableLineItems"
            placeholder="Select existing line item"
            :getOptionDescription="getCustomDescriptionLineItem"
            required
          ></vue-single-select>
          <div
            id="or"
            v-if="!newCommittee.committee_name && !newCommittee.line_item"
          >
            OR
          </div>
          <b-input
            class="committee-name-input"
            v-if="!newCommittee.line_item"
            v-model="newCommittee.committee_name"
            placeholder="Create new"
          ></b-input>
          <b-button
            id="add"
            :disabled="!newCommittee.committee_name && !newCommittee.line_item"
            variant="primary"
            type="submit"
            >Add</b-button
          >
        </b-form>
      </div>
      <div id="committees" v-if="committees.length > 0">
        <b-card
          v-for="(committee, index) in committees"
          :key="index"
          no-body
          class="mb-1"
        >
          <b-card-header class="p-1" header-tag="header" role="tab">
            <div
              class="card-header-content"
              v-b-toggle="'content-' + committee.committee_id"
            >
              <b-icon-caret-down-fill
                class="when-closed"
              ></b-icon-caret-down-fill>
              <b-icon-caret-up-fill class="when-open"></b-icon-caret-up-fill>
              <strong>{{ " " + committee.committee_name }}</strong>
            </div>
            <b-button
              class="delete-button"
              variant="danger"
              @click="prepareDeletion(committee)"
              >Delete</b-button
            >
          </b-card-header>
          <b-collapse :id="'content-' + committee.committee_id" role="tabpanel">
            <b-card-body>
              <b-form>
                <b-form-group label="Chair:">
                  <vue-single-select
                    v-model="committee.chair"
                    :options="actives"
                    optionLabel="name"
                    @input="saveChair(committee)"
                  ></vue-single-select>
                </b-form-group>
                <b-form-group label="Committee Members:">
                  <VueTaggableSelect
                    class="member-tags"
                    placeholder="Add"
                    v-model="committee.members_new"
                    :options="actives"
                    optionLabel="name"
                    @input="saveMembers(committee)"
                  ></VueTaggableSelect>
                </b-form-group>
              </b-form>
            </b-card-body>
          </b-collapse>
        </b-card>
      </div>
      <h3 v-else>No committees found</h3>
    </div>
    <LoadingSpinner v-else />
  </div>
</template>

<script>
import axios from "axios";
import { AUTH_TIERS, API_URL } from "../constants/index.js";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import VueTaggableSelect from "@/components/VueTaggableSelect.vue";
export default {
  components: {
    LoadingSpinner,
    VueTaggableSelect,
  },
  created() {
    this.loadActives();
  },
  data() {
    return {
      AUTH_TIERS: AUTH_TIERS,
      availableLineItems: null,
      committees: [],
      actives: null,
      newCommittee: {
        line_item_id: null,
        committee_name: null,
      },
      editedCommittee: null,
      toDelete: {
        line_item_id: null,
        committee_name: null,
      },
      loaded: false,
    };
  },
  methods: {
    loadActives() {
      axios
        .get(API_URL + "read_active_id_name_only.php", {
          headers: { Authorization: this.$store.state.jwt },
        })
        .then((response) => {
          this.actives = response.data.body;
          this.loadLineItems();
        })
        .catch((error) => {
          this.$root.$children[0].showError(error.response.statusText);
        });
    },
    loadLineItems() {
      axios
        .get(API_URL + "read_line_items_without_committees.php", {
          headers: { Authorization: this.$store.state.jwt },
        })
        .then((response) => {
          this.availableLineItems = response.data.body;
          this.loadData();
        })
        .catch((error) => {
          this.$root.$children[0].showError(error.response.statusText);
        });
    },
    loadData() {
      this.loaded = false;
      axios
        .get(API_URL + "read_committee_members.php", {
          headers: { Authorization: this.$store.state.jwt },
        })
        .then((response) => {
          response.data.body.forEach((x) => {
            if (x.chair_id != null) {
              x.chair = this.actives.find((y) => y.id == x.chair_id);
            }
            x.members_new = JSON.parse(JSON.stringify(x.members));
          });
          this.committees = response.data.body;
          this.loaded = true;
        })
        .catch((error) => {
          this.$root.$children[0].showError(error.response.statusText);
        });
    },
    getCustomDescriptionLineItem(option) {
      return option.line_item_name;
    },
    getCustomValue(option) {
      return option.line_item_id;
    },
    onSubmit() {
      if (this.committees.find(this.committeeNameExists)) {
        let modalTitle = "Committee Already Exists";
        let modalMessage =
          'A committee with name "' +
          this.newCommittee.committee_name +
          '" already exists. Please select a unique committee name.';
        this.$root.$children[0].showMessage(modalTitle, modalMessage);
      } else {
        axios
          .post(
            API_URL + "create_committee.php",
            JSON.stringify(this.newCommittee),
            { headers: { Authorization: this.$store.state.jwt } }
          )
          .then((response) => {
            this.$root.$children[0].showSuccess(response.data.message);
            this.newCommittee.committee_name = null;
            this.newCommittee.line_item = null;
            this.loadLineItems();
          })
          .catch((error) =>
            this.$root.$children[0].showError(error.response.statusText)
          );
      }
    },
    committeeNameExists(committee) {
      return committee.committee_name == this.newCommittee.committee_name;
    },
    prepareDeletion(committee) {
      this.toDelete = committee;
      this.$bvModal.show("delete-committee-modal");
    },
    deleteCommittee() {
      axios
        .delete(
          API_URL + "delete_committee.php?id=" + this.toDelete.committee_id,
          {
            headers: { Authorization: this.$store.state.jwt },
          }
        )
        .then((response) => {
          this.$root.$children[0].showSuccess(response.data.message);
          this.loadLineItems();
        })
        .catch((error) => {
          this.$root.$children[0].showError(error.response.statusText);
        });
    },
    saveChair(committee) {
      if (this.chairChanged(committee)) {
        committee.chair_id = committee.chair ? committee.chair.id : null;
        axios
          .post(API_URL + "update_committee.php", committee, {
            headers: { Authorization: this.$store.state.jwt },
          })
          .catch((error) => {
            this.loadData();
            this.$root.$children[0].showError(error.response.statusText);
          });
      }
    },
    saveMembers(committee) {
      if (this.membersChanged(committee)) {
        committee.members = JSON.parse(JSON.stringify(committee.members_new));
        axios
          .post(API_URL + "update_committee_members.php", committee, {
            headers: { Authorization: this.$store.state.jwt },
          })
          .catch((error) => {
            this.loadData();
            this.$root.$children[0].showError(error.response.statusText);
          });
      }
    },
    chairChanged(committee) {
      if (committee.chair_id != null && committee.chair != null) {
        return committee.chair_id != committee.chair.id;
      } else {
        return committee.chair_id != null || committee.chair != null;
      }
    },
    membersChanged(committee) {
      return (
        JSON.stringify(committee.members) !==
        JSON.stringify(committee.members_new)
      );
    },
  },
};
</script>

<style scoped>
.p-1 {
  display: flex;
}
.card-header-content {
  cursor: pointer;
  padding: 5px;
  width: 100%;
}
.collapsed > .when-open,
.not-collapsed > .when-closed {
  display: none;
}
h4 {
  margin-bottom: 20px;
}
#create-new {
  margin: auto;
  padding: 20px;
}
#create-form {
  justify-content: center;
}
.line-item-select {
  margin-top: 8px;
  width: 250px;
}
.committee-name-input {
  width: 250px;
}
#or {
  margin-right: 10px;
  margin-left: 10px;
}
#add {
  margin-left: 10px;
}
#committees {
  max-width: 500px;
  margin: auto;
}
.member-tags {
  background-color: white;
}
.delete-button {
  padding: 0 6px 0 6px;
}
</style>
