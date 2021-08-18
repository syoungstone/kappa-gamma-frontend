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
            v-model="search"
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
        class="b-table"
        striped
        hover
        :items="filteredData"
        :fields="fields"
        stacked="md"
        show-empty
        :current-page="currentPage"
        :per-page="perPage"
        sort-icon-left
      >
        <template #cell(phone)="row">
          <a :href="'tel:' + row.item.phone_number">
            {{ formatPhone(row.item.phone_number) }}
          </a>
        </template>
        <template #cell(email_link)="row">
          <div v-if="row.item.email == 'N/A'">{{ row.item.email }}</div>
          <a v-else :href="'mailto:' + row.item.email" target="_blank">{{
            row.item.email
          }}</a>
        </template>
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
            v-if="$store.state.authTier >= AUTH_TIERS.OFFICER"
            variant="primary"
            size="sm"
            @click="editStudent(row.item.id)"
          >
            Edit
          </b-button>
          <b-button
            class="select-button"
            v-if="$store.state.authTier >= AUTH_TIERS.OFFICER"
            variant="danger"
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
      <div id="separator"></div>
      <b-col id="pages" sm="7" md="6" class="my-1">
        <b-pagination
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
import { AUTH_TIERS, API_URL } from "../constants/index.js";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
export default {
  components: {
    LoadingSpinner,
  },
  created() {
    this.getStudents();
  },
  computed: {
    filteredData() {
      return this.data.filter(this.filterData);
    },
    totalRows() {
      return this.filteredData.length;
    },
  },
  data() {
    return {
      AUTH_TIERS: AUTH_TIERS,
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
        { key: "name_first", label: "First Name" },
        { key: "phone" },
        { key: "email_link", label: "Email" },
        { key: "actions", label: "Actions" },
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
      currentPage: 1,
      perPage: 5,
      search: null,
      loaded: false,
      toDeleteName: null,
      toDeleteId: null,
    };
  },
  methods: {
    getStudents() {
      axios
        .get(API_URL + "read_students.php", {
          headers: { Authorization: this.$store.state.jwt },
        })
        .then((response) => {
          this.data = response.data.body;
          this.getFirstEmail();
          this.appendGradYears();
          this.getPledgeClasses();
        })
        .catch((error) =>
          this.$root.$children[0].showError(error.response.statusText)
        );
    },
    getFirstEmail() {
      let i;
      for (i = 0; i < this.data.length; i++) {
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
        .get(API_URL + "read_pledge_classes.php", {
          headers: { Authorization: this.$store.state.jwt },
        })
        .then((response) => {
          let i;
          for (i = 0; i < response.data.itemCount; i++) {
            this.pledgeClassOptions.push(response.data.body[i].class_name);
          }
          this.loaded = true;
        })
        .catch((error) =>
          this.$root.$children[0].showError(error.response.statusText)
        );
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
      if (this.search != null && this.search.trim() != "") {
        let searchMatchesFirst = student.name_first
          .toLowerCase()
          .includes(this.search.trim().toLowerCase());
        let searchMatchesMiddle = student.name_middle
          ? student.name_middle
              .toLowerCase()
              .includes(this.search.trim().toLowerCase())
          : false;
        let searchMatchesLast = student.name_last
          .toLowerCase()
          .includes(this.search.trim().toLowerCase());
        accept =
          accept &&
          (searchMatchesFirst || searchMatchesMiddle || searchMatchesLast);
      }
      return accept;
    },
    formatPhone(numberString) {
      return (
        "(" +
        numberString.substring(0, 3) +
        ") " +
        numberString.substring(3, 6) +
        "-" +
        numberString.substring(6)
      );
    },
    viewStudent(id) {
      this.$router.push("/student/" + id, () => {});
    },
    editStudent(id) {
      this.$router.push("/editstudent/" + id, () => {});
    },
    prepareDeletion(id, firstName, lastName) {
      this.toDeleteName = firstName + " " + lastName;
      this.toDeleteId = id;
      this.$bvModal.show("delete-student-modal");
    },
    deleteStudent() {
      axios
        .delete(API_URL + "delete_student.php?id=" + this.toDeleteId, {
          headers: { Authorization: this.$store.state.jwt },
        })
        .then((response) => {
          this.$root.$children[0].showSuccess(response.data.message);
          this.getStudents();
        })
        .catch((error) =>
          this.$root.$children[0].showError(error.response.statusText)
        );
    },
  },
};
</script>

<style scoped>
.select-button {
  margin: 0px 5px;
}
#buttons {
  text-align: center;
}
#search {
  margin-top: 20px;
}
#separator {
  margin: 50px;
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
