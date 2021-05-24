<template>
  <div class="wide-wrapper">
    <h1>Lineages</h1>
    <div v-if="loaded">
      <div v-if="$store.state.position != null" id="create-new">
        <b-modal
          id="delete-lineage-modal"
          ref="modal"
          title="Warning: Deleting Lineage"
          @ok="deleteLineage()"
        >
          <p>
            Are you sure you want to delete the
            {{ toDelete.lineage_name }} lineage? After a lineage is deleted, it
            cannot be retrieved. It is strongly suggested not to delete a
            lineage unless you intend to replace it with another right away.
          </p>
          <template #modal-footer="{ cancel, ok }">
            <b-button size="sm" @click="cancel()"> Cancel </b-button>
            <b-button size="sm" variant="danger" @click="ok()">
              Delete Anyway
            </b-button>
          </template>
        </b-modal>

        <h4>Create new lineage</h4>
        <b-form inline @submit.prevent="onSubmit" id="create-form">
          <b-form-input
            id="inline-form-input-name"
            class="mb-2 mr-sm-2 mb-sm-0"
            placeholder="Lineage Name"
            v-model="newLineage.lineage_name"
            required
          ></b-form-input>
          <vue-single-select
            class="founder-select"
            v-model="newFounder"
            :options="brothers"
            option-key="id"
            optionValue="id"
            placeholder="Founder Name"
            required
            :getOptionDescription="getCustomDescription"
          ></vue-single-select>
          <b-button variant="primary" type="submit">Create</b-button>
        </b-form>
      </div>
      <b-table
        striped
        hover
        small
        :items="lineages"
        :fields="fields"
        id="lineage-table"
      >
        <template #cell(actions)="row">
          <b-button
            class="select-button"
            size="sm"
            @click="viewLineage(row.item.lineage_id)"
          >
            View
          </b-button>
          <b-button
            class="select-button"
            v-if="$store.state.position != null"
            size="sm"
            @click="prepareDeletion(row.item)"
          >
            Delete
          </b-button>
        </template>
      </b-table>
    </div>
    <LoadingSpinner v-else />
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
    if (this.$store.state.position != null) {
      this.readBrothers();
    } else {
      this.load();
    }
  },
  data() {
    return {
      lineages: null,
      brothers: null,
      fields: [
        {
          key: "lineage_name",
          label: "Name",
        },
        {
          key: "founder_name",
          label: "Founder",
        },
        { key: "actions", label: "Actions" },
      ],
      newFounder: null,
      newLineage: {
        lineage_name: null,
        founder_name: null,
        founder: null,
      },
      toDelete: {
        lineage_name: null,
        founder_name: null,
        founder: null,
      },
      loaded: false,
    };
  },
  methods: {
    onSubmit() {
      this.newLineage.founder = this.newFounder.id;
      this.newLineage.founder_name = this.getCustomDescription(this.newFounder);
      if (this.lineages.find(this.lineageNameExists)) {
        let modalTitle = "Lineage Already Exists";
        let modalMessage =
          'A lineage with name "' +
          this.newLineage.lineage_name +
          '" already exists. Please select a unique lineage name.';
        this.$root.$children[0].showMessage(modalTitle, modalMessage);
      } else if (this.lineages.find(this.founderExists)) {
        let modalTitle = "No Duplicate Lineage Founders";
        let modalMessage =
          this.newLineage.founder_name +
          " is already listed as the founder of another lineage. Please select a unique founder.";
        this.$root.$children[0].showMessage(modalTitle, modalMessage);
      } else {
        axios
          .post(
            this.$store.state.apiURL + "create_lineage.php",
            JSON.stringify(this.newLineage),
            { headers: { Authorization: this.$store.state.jwt } }
          )
          .then(() => {
            this.newLineage.lineage_name = null;
            this.newLineage.founder_name = null;
            this.newLineage.founder = null;
            this.load();
          })
          .catch((error) => this.$root.$children[0].showError(error));
      }
    },
    readBrothers() {
      axios
        .get(this.$store.state.apiURL + "read_brothers.php", {
          headers: { Authorization: this.$store.state.jwt },
        })
        .then((response) => {
          this.brothers = response.data.body;
          this.load();
        })
        .catch((error) => this.$root.$children[0].showError(error));
    },
    load() {
      axios
        .get(this.$store.state.apiURL + "read_lineages.php", {
          headers: { Authorization: this.$store.state.jwt },
        })
        .then((response) => {
          this.lineages = response.data.body;
          this.loaded = true;
        })
        .catch((error) => this.$root.$children[0].showError(error));
    },
    prepareDeletion(lineage) {
      this.toDelete = lineage;
      this.$bvModal.show("delete-lineage-modal");
    },
    deleteLineage() {
      axios
        .delete(
          this.$store.state.apiURL +
            "delete_lineage.php?id=" +
            this.toDelete.lineage_id,
          {
            headers: { Authorization: this.$store.state.jwt },
          }
        )
        .then((response) => {
          this.$root.$children[0].showSuccess(response.data.message);
          this.load();
        })
        .catch((error) => {
          this.$root.$children[0].showError(error);
        });
    },
    viewLineage(id) {
      this.$router.push("/lineage/" + id, () => {});
    },
    lineageNameExists(lineage) {
      return lineage.lineage_name == this.newLineage.lineage_name;
    },
    founderExists(lineage) {
      return lineage.founder == this.newLineage.founder;
    },
    getCustomDescription(option) {
      return option.name_first + " " + option.name_last;
    },
  },
};
</script>

<style scoped>
.founder-select {
  margin-top: 8px;
  margin-right: 10px;
}
.select-button {
  margin: 5px;
}
#lineage-table {
  max-width: 500px;
  margin: auto;
}
#create-new {
  margin: auto;
  padding: 20px;
}
#create-form {
  justify-content: center;
}
</style>
