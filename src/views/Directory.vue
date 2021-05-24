<template>
  <div class="wide-wrapper">
    <h1>Directory</h1>
    <div v-if="loaded" id="contents">
      <b-modal
        id="delete-student-modal"
        ref="modal"
        title="Delete Student"
        @ok="deleteStudent()"
      >
        <p>
          Are you sure you want to delete {{ this.toDeleteName }}? This action
          cannot be undone. <br /><br />
          Please note that a brother may only be deleted if all financial and
          leadership information associated with them has been deleted first.
        </p>
        <template #modal-footer="{ cancel, ok }">
          <b-button size="sm" @click="cancel()"> Cancel </b-button>
          <b-button size="sm" variant="danger" @click="ok()"> Delete </b-button>
        </template>
      </b-modal>

      <b-col sm="7" md="6" class="my-1">
        <b-input-group size="sm" id="search">
          <b-form-input
            id="filter-input"
            v-model="filter"
            type="search"
            placeholder="Type to Search"
          ></b-form-input>
          <b-button
            class="select-button"
            size="sm"
            @click="showFilters = !showFilters"
            >{{ showFilters ? "Hide Filters" : "Show Filters" }}</b-button
          >
        </b-input-group>
      </b-col>

      <div v-if="showFilters" class="row justify-content-center filters">
        <b-form-group
          class="filter"
          id="input-group-1"
          label="Pledge/Brother:"
          label-for="input-1"
        >
          <b-form-select
            id="input-1"
            v-model="isPledge"
            :options="isPledgeOptions"
          ></b-form-select>
        </b-form-group>
        <b-form-group
          class="filter"
          id="input-group-2"
          label="Status:"
          label-for="input-2"
        >
          <b-form-select
            id="input-2"
            v-model="brotherStatus"
            :options="brotherStatusOptions"
          ></b-form-select>
        </b-form-group>
        <b-form-group
          class="filter"
          id="input-group-3"
          label="Pledge Class:"
          label-for="input-3"
        >
          <b-form-select
            id="input-3"
            v-model="pledgeClass"
            :options="pledgeClassOptions"
          ></b-form-select>
        </b-form-group>
        <b-form-group
          class="filter"
          id="input-group-4"
          label="Major:"
          label-for="input-4"
        >
          <b-form-select
            id="input-4"
            v-model="major"
            :options="majorOptions"
          ></b-form-select>
        </b-form-group>
        <b-form-group
          class="filter"
          id="input-group-5"
          label="Grad Year:"
          label-for="input-5"
        >
          <b-form-select
            id="input-5"
            v-model="gradYear"
            :options="gradYearOptions"
          ></b-form-select>
        </b-form-group>
      </div>

      <b-table
        striped
        hover
        :items="narrowedData"
        :fields="fields"
        :filter="filter"
        :filter-included-fields="filter_included_fields"
        stacked="md"
        show-empty
        @filtered="onFiltered"
        :current-page="currentPage"
        :per-page="perPage"
      >
        <template #cell(actions)="row">
          <b-button
            class="select-button"
            size="sm"
            @click="viewStudent(row.item.id)"
          >
            View
          </b-button>
          <b-button
            class="select-button"
            v-if="$store.state.position != null"
            size="sm"
            @click="editStudent(row.item.id)"
          >
            Edit
          </b-button>
          <b-button
            class="select-button"
            v-if="$store.state.position != null"
            size="sm"
            @click="
              prepareDeletion(
                row.item.id,
                row.item.name_first,
                row.item.name_last
              )
            "
          >
            Delete
          </b-button>
        </template>
      </b-table>
      <b-col sm="7" md="6" class="my-1">
        <b-pagination
          id="pages"
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
          align="fill"
          size="sm"
          class="my-0"
        ></b-pagination>
      </b-col>
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
    this.getStudents();
  },
  computed: {
    narrowedData: function () {
      return this.data.filter(this.filterData);
    },
  },
  data() {
    return {
      showFilters: false,
      fields: [
        {
          key: "roll_number",
          label: "Roll",
          sortable: true,
        },
        {
          key: "name_last",
          label: "Last Name",
          sortable: true,
        },
        {
          key: "name_first",
          label: "First Name",
          sortable: true,
        },
        {
          key: "phone_number",
          label: "Phone",
          sortable: false,
        },
        {
          key: "email",
          sortable: false,
        },
        { key: "actions", label: "Actions", sortable: false },
      ],
      data: [],
      isPledgeOptions: [
        { value: null, text: "All" },
        { value: 1, text: "Pledge" },
        { value: 0, text: "Brother" },
      ],
      isPledge: null,
      brotherStatusOptions: [
        { value: null, text: "All" },
        { value: "active", text: "Active" },
        { value: "inactive", text: "Inactive" },
        { value: "early alum", text: "Early Alum" },
        { value: "alumni", text: "Alumni" },
      ],
      brotherStatus: null,
      pledgeClassOptions: [{ value: null, text: "All" }],
      pledgeClass: null,
      majorOptions: [
        { value: null, text: "All" },
        { value: "Biomedical Engineering", text: "BME" },
        { value: "Chemical and Life Science Engineering", text: "CLSE" },
        { value: "Computer Engineering", text: "CE" },
        { value: "Computer Science", text: "CS" },
        { value: "Electrical Engineering", text: "EE" },
        { value: "Mechanical Engineering", text: "MNE" },
      ],
      major: null,
      gradYearOptions: [{ value: null, text: "All" }],
      gradYear: null,
      totalRows: 1,
      currentPage: 1,
      perPage: 5,
      filter: null,
      filter_included_fields: ["name_first", "name_middle", "name_last"],
      response: null,
      error: null,
      loaded: false,
      toDeleteName: null,
      toDeleteId: null,
    };
  },
  methods: {
    getStudents() {
      axios
        .get(this.$store.state.apiURL + "read_students.php", {
          headers: { Authorization: this.$store.state.jwt },
        })
        .then((response) => {
          this.data = response.data.body;
          this.totalRows = this.data.length;
          this.getFirstEmail();
          this.appendGradYears();
          this.getPledgeClasses();
        })
        .catch((error) => this.$root.$children[0].showError(error));
    },
    getFirstEmail() {
      let i;
      for (i = 0; i < this.totalRows; i++) {
        if (this.data[i].emails != null) {
          this.data[i].email = this.data[i].emails.split(",")[0];
        } else {
          this.data[i].email = "N/A";
        }
      }
    },
    appendGradYears() {
      let i;
      for (i = new Date().getFullYear() + 5; i >= 1998; i--) {
        this.gradYearOptions.push(i);
      }
    },
    getPledgeClasses() {
      axios
        .get(this.$store.state.apiURL + "read_pledge_classes.php", {
          headers: { Authorization: this.$store.state.jwt },
        })
        .then((response) => {
          let i;
          for (i = 0; i < response.data.body.length; i++) {
            this.pledgeClassOptions.push(response.data.body[i].class_name);
          }
          this.loaded = true;
        })
        .catch((error) => this.$root.$children[0].showError(error));
    },
    filterData(student) {
      let accept = true;
      if (this.gradYear != null) {
        accept = accept && student.grad_year == this.gradYear;
      }
      if (this.pledgeClass != null) {
        accept = accept && student.pledge_class == this.pledgeClass;
      }
      if (this.isPledge != null) {
        accept = accept && student.is_pledge == this.isPledge;
      }
      if (this.brotherStatus != null) {
        accept = accept && student.brother_status == this.brotherStatus;
      }
      if (this.major != null) {
        accept = accept && student.majors.includes(this.major);
      }
      return accept;
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      console.log(this.filter);
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    viewStudent(id) {
      this.$router.push("/student/" + id, () => {});
    },
    editStudent(id) {
      this.$router.push("/edit/" + id, () => {});
    },
    prepareDeletion(id, firstName, lastName) {
      this.toDeleteName = firstName + " " + lastName;
      this.toDeleteId = id;
      this.$bvModal.show("delete-student-modal");
    },
    deleteStudent() {
      // this.$bvModal.hide();
      axios
        .delete(
          this.$store.state.apiURL + "delete_student.php?id=" + this.toDeleteId,
          {
            headers: { Authorization: this.$store.state.jwt },
          }
        )
        .then((response) => {
          let modalTitle = "Student Deleted";
          let modalMessage = response.data;
          this.$root.$children[0].showMessage(modalTitle, modalMessage);
          this.getStudents();
        })
        .catch((error) => this.$root.$children[0].showError(error));
    },
  },
};
</script>

<style scoped>
.select-button {
  margin: 0px 5px;
}
#buttons,
#error,
#response {
  text-align: center;
}
#search,
#pages {
  margin-top: 20px;
}
#contents > * {
  margin: auto;
  margin-top: 20px;
}
.filters {
  background-color: var(--ot-off-white);
  border-radius: 10px;
  padding: 15px;
}
.filter {
  font-weight: bold;
  font-size: 15px;
  margin: 0px 10px;
  min-width: 150px;
}
</style>
