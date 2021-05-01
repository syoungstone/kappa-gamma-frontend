<template>
  <div class="about" id="wide-wrapper">
    <h1>Pledge Classes</h1>
    <div v-if="loaded">
      <div v-if="$store.state.isOfficer" id="create-new">
        <b-modal
          id="delete-pledge-class-modal"
          ref="modal"
          title="Cannot Delete Pledge Class"
          hide-footer
        >
          <p>
            Pledge class {{ this.toDelete.class_name }} cannot be deleted until
            all of its members have been assigned to a new pledge class.
          </p>
        </b-modal>

        <b-modal
          id="name-exists-modal"
          ref="modal"
          title="Pledge Class Already Exists"
          hide-footer
        >
          <p>{{ this.modalMessage }}</p>
        </b-modal>

        <h4>Create new pledge class</h4>
        <b-form inline @submit="onSubmit" id="create-form">
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
        striped
        hover
        small
        :items="pledgeClasses"
        :fields="fields"
        id="class-table"
      >
        <template #cell(semestername)="data">
          {{ data.item.semester == "F" ? "Fall " : "Spring " }}
        </template>
        <template #cell(actions)="row">
          <b-button
            class="select-button"
            size="sm"
            @click="
              viewPledgeClass(row.item.semester, row.item.accounting_year)
            "
          >
            View
          </b-button>
          <b-button
            class="select-button"
            v-if="$store.state.isOfficer"
            size="sm"
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
    <div v-if="error" class="mt-3">
      <strong>{{ error }}</strong>
    </div>
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
    this.load();
  },
  data() {
    return {
      pledgeClasses: null,
      fields: [
        {
          key: "class_name",
        },
        {
          key: "semestername",
          label: "Semester",
        },
        {
          key: "accounting_year",
          label: "Year",
        },
        { key: "actions", label: "Actions" },
      ],
      newPledgeClass: {
        class_name: null,
        accounting_year: null,
        semester: null,
      },
      toDelete: {
        class_name: null,
      },
      error: null,
      loaded: false,
      modalMessage: "",
    };
  },
  methods: {
    onSubmit() {
      if (this.pledgeClasses.find(this.classNameExists)) {
        this.modalMessage =
          'A pledge class with name "' +
          this.newPledgeClass.class_name +
          '" already exists. Please select a unique pledge class name.';
        this.$bvModal.show("name-exists-modal");
      } else if (this.pledgeClasses.find(this.classYearSemesterExists)) {
        this.modalMessage =
          "A pledge class for " +
          (this.newPledgeClass.semester == "F" ? "Fall " : "Spring ") +
          this.newPledgeClass.accounting_year +
          " already exists. Please select a different semester/year combination.";
        this.$bvModal.show("name-exists-modal");
      } else {
        axios
          .post(
            this.$store.state.apiURL + "create_pledge_class.php",
            JSON.stringify(this.newPledgeClass),
            { headers: { Authorization: this.$store.state.jwt } }
          )
          .then(() => {
            this.newPledgeClass.class_name = null;
            this.newPledgeClass.accounting_year = null;
            this.newPledgeClass.semester = null;
            this.load();
          })
          .catch((error) => (this.error = error));
      }
    },
    load() {
      axios
        .get(this.$store.state.apiURL + "read_pledge_classes.php", {
          headers: { Authorization: this.$store.state.jwt },
        })
        .then((response) => {
          this.pledgeClasses = JSON.parse(response.data.substring(1)).body;
          this.newPledgeClass.accounting_year = new Date().getFullYear();
          this.loaded = true;
        })
        .catch((error) => (this.error = error));
    },
    deletePledgeClass(deleteMe, numStudents) {
      this.toDelete.class_name = deleteMe;
      if (numStudents > 0) {
        this.$bvModal.show("delete-pledge-class-modal");
      } else {
        axios
          .delete(this.$store.state.apiURL + "delete_pledge_class.php", {
            data: this.toDelete,
            headers: { Authorization: this.$store.state.jwt },
          })
          .then(() => {
            this.load();
          })
          .catch((error) => (this.error = error));
      }
    },
    viewPledgeClass(semester, year) {
      this.$router.push("/pledgeclass/" + semester + year, () => {});
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

<style>
.select-button {
  margin: 5px;
}
#class-table {
  max-width: 500px;
  margin: auto;
}
#wide-wrapper {
  max-width: 1000px;
  padding: 20px;
  margin: 50px auto;
  text-align: center;
}
#create-new {
  margin: auto;
  padding: 20px;
}
#create-form {
  justify-content: center;
}
</style>
