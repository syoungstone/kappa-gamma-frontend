<template>
  <div class="wide-wrapper">
    <h1>Pledge Classes</h1>
    <div v-if="loaded">
      <div
        v-if="$store.state.permissionTier >= AUTH_TIERS.OFFICER"
        id="create-new"
      >
        <h4>Create new pledge class</h4>
        <b-form inline @submit.prevent="onSubmit" id="create-form">
          <b-form-input
            id="inline-form-input-name"
            class="mb-2 mr-sm-2 mb-sm-0"
            placeholder="Class Name"
            v-model="newPledgeClass.class_name"
            required
          ></b-form-input>
          <b-form-select
            id="inline-form-custom-select-pref"
            class="mb-2 mr-sm-2 mb-sm-0"
            :options="[
              { text: 'Semester', value: null },
              { text: 'Fall', value: 'F' },
              { text: 'Spring', value: 'S' },
            ]"
            v-model="newPledgeClass.semester"
            placeholder="Semester"
            required
          ></b-form-select>
          <b-form-input
            id="inline-form-input-name"
            class="mb-2 mr-sm-2 mb-sm-0"
            type="number"
            placeholder="Year"
            v-model="newPledgeClass.accounting_year"
            required
          ></b-form-input>
          <b-button variant="primary" type="submit">Create</b-button>
        </b-form>
      </div>
      <b-table
        class="b-table"
        striped
        hover
        :items="pledgeClasses"
        :fields="fields"
        id="class-table"
      >
        <template #cell(class_name_field)="row">
          <router-link
            :to="'/pledgeclass/' + row.item.semester + row.item.accounting_year"
          >
            {{ row.item.class_name }}
          </router-link>
        </template>
        <template #cell(semester_name)="row">
          {{ row.item.semester == "F" ? "Fall " : "Spring " }}
        </template>
        <template #cell(actions)="row">
          <b-button
            class="select-button"
            v-if="$store.state.permissionTier >= AUTH_TIERS.OFFICER"
            size="sm"
            variant="danger"
            @click="
              deletePledgeClass(row.item.class_name, row.item.num_students)
            "
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
import { AUTH_TIERS, API_URL } from "../constants/index.js";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
export default {
  components: {
    LoadingSpinner,
  },
  created() {
    this.load();
  },
  data() {
    return {
      AUTH_TIERS: AUTH_TIERS,
      pledgeClasses: null,
      newPledgeClass: {
        class_name: null,
        accounting_year: null,
        semester: null,
      },
      toDelete: {
        class_name: null,
      },
      loaded: false,
    };
  },
  computed: {
    fields() {
      let fields = [
        {
          key: "class_name_field",
          label: "Class Name",
        },
        {
          key: "semester_name",
          label: "Semester",
        },
        {
          key: "accounting_year",
          label: "Year",
        },
        {
          key: "num_students",
          label: "Size",
        },
      ];
      if (this.$store.state.permissionTier >= AUTH_TIERS.OFFICER) {
        fields.push({ key: "actions" });
      }
      return fields;
    },
  },
  methods: {
    onSubmit() {
      if (this.pledgeClasses.find(this.classNameExists)) {
        let modalTitle = "Pledge Class Already Exists";
        let modalMessage =
          'A pledge class with name "' +
          this.newPledgeClass.class_name +
          '" already exists. Please select a unique pledge class name.';
        this.$root.$children[0].showMessage(modalTitle, modalMessage);
      } else if (this.pledgeClasses.find(this.classYearSemesterExists)) {
        let modalTitle = "Pledge Class Already Exists";
        let modalMessage =
          "A pledge class for " +
          (this.newPledgeClass.semester == "F" ? "Fall " : "Spring ") +
          this.newPledgeClass.accounting_year +
          " already exists. Please select a different semester/year combination.";
        this.$root.$children[0].showMessage(modalTitle, modalMessage);
      } else {
        axios
          .post(
            API_URL + "create_pledge_class.php",
            JSON.stringify(this.newPledgeClass),
            { headers: { Authorization: this.$store.state.jwt } }
          )
          .then((response) => {
            this.$root.$children[0].showSuccess(response.data.message);
            this.newPledgeClass.class_name = null;
            this.newPledgeClass.accounting_year = null;
            this.newPledgeClass.semester = null;
            this.load();
          })
          .catch((error) =>
            this.$root.$children[0].showError(error.response.statusText)
          );
      }
    },
    load() {
      axios
        .get(API_URL + "read_pledge_classes.php", {
          headers: { Authorization: this.$store.state.jwt },
        })
        .then((response) => {
          this.pledgeClasses = response.data.body;
          this.newPledgeClass.accounting_year = new Date().getFullYear();
          this.loaded = true;
        })
        .catch((error) =>
          this.$root.$children[0].showError(error.response.statusText)
        );
    },
    deletePledgeClass(deleteMe, numStudents) {
      this.toDelete.class_name = deleteMe;
      if (numStudents > 0) {
        let modalTitle = "Cannot Delete Pledge Class";
        let modalMessage =
          "Pledge class " +
          this.toDelete.class_name +
          " cannot be deleted until all of its members have been assigned to a new pledge class.";
        this.$root.$children[0].showMessage(modalTitle, modalMessage);
      } else {
        axios
          .delete(API_URL + "delete_pledge_class.php", {
            data: this.toDelete,
            headers: { Authorization: this.$store.state.jwt },
          })
          .then((response) => {
            this.$root.$children[0].showSuccess(response.data.message);
            this.load();
          })
          .catch((error) =>
            this.$root.$children[0].showError(error.response.statusText)
          );
      }
    },
    classNameExists(pledgeClass) {
      return pledgeClass.class_name == this.newPledgeClass.class_name;
    },
    classYearSemesterExists(pledgeClass) {
      return (
        pledgeClass.semester == this.newPledgeClass.semester &&
        pledgeClass.accounting_year == this.newPledgeClass.accounting_year
      );
    },
  },
};
</script>

<style scoped>
h4 {
  margin-bottom: 20px;
}
#class-table {
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
