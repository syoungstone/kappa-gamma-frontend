<template>
  <div id="wrapper">
    <h1>Directory</h1>
    <div v-if="loaded" id="contents">
      <b-col sm="7" md="6" class="my-1">
        <b-input-group size="sm" id="search">
          <b-form-input
            id="filter-input"
            v-model="filter"
            type="search"
            placeholder="Type to Search"
          ></b-form-input>

          <b-input-group-append>
            <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
          </b-input-group-append>
        </b-input-group>
      </b-col>
      <div id="buttons">
        <b-button class="select-button" :pressed="active" @click="showActive()"
          >Active Brothers</b-button
        >
        <b-button
          class="select-button"
          :pressed="pledges"
          @click="showPledges()"
          >Pledges</b-button
        >
        <b-button class="select-button" :pressed="alumni" @click="showAlumni()"
          >Alumni</b-button
        >
        <b-button class="select-button" :pressed="all" @click="showAll()"
          >Show All</b-button
        >
      </div>
      <b-table
        striped
        hover
        :items="data.body"
        :fields="fields"
        :filter="filter"
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
            @click="viewStudent(row.item.id, row.item.is_pledge)"
          >
            View
          </b-button>
          <b-button
            class="select-button"
            v-if="$store.state.isOfficer"
            size="sm"
            @click="editStudent(row.item.id, row.item.is_pledge)"
          >
            Edit
          </b-button>
          <b-button
            class="select-button"
            v-if="$store.state.isOfficer"
            size="sm"
            @click="deleteStudent(row.item.id, row.item.is_pledge)"
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
    <h3 v-else>Loading...</h3>
    <div v-if="error" class="mt-3" id="error">
      <strong>{{ error }}</strong>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  created() {
    axios
      .get(process.env.VUE_APP_API + "read_active.php", {
        headers: { Authorization: this.$store.state.jwt },
      })
      .then((response) => {
        this.data = JSON.parse(response.data.substring(1));
        this.loaded = true;
        this.totalRows = this.data.body.length;
      })
      .catch((error) => (this.error = error));
  },
  data() {
    return {
      selected: null,
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
      totalRows: 1,
      currentPage: 1,
      perPage: 5,
      filter: null,
      response: null,
      error: null,
      loaded: false,
      active: true,
      pledges: false,
      alumni: false,
      all: false,
    };
  },
  methods: {
    showActive() {
      this.active = true;
      this.pledges = false;
      this.alumni = false;
      this.all = false;
      this.loaded = false;
      axios
        .get(process.env.VUE_APP_API + "read_active.php", {
          headers: { Authorization: this.$store.state.jwt },
        })
        .then((response) => {
          this.data = JSON.parse(response.data.substring(1));
          this.loaded = true;
          this.totalRows = this.data.body.length;
        })
        .catch((error) => (this.error = error));
    },
    showPledges() {
      this.active = false;
      this.pledges = true;
      this.alumni = false;
      this.all = false;
      this.loaded = false;
      axios
        .get(process.env.VUE_APP_API + "read_pledges.php", {
          headers: { Authorization: this.$store.state.jwt },
        })
        .then((response) => {
          this.data = JSON.parse(response.data.substring(1));
          this.loaded = true;
          this.totalRows = this.data.body.length;
        })
        .catch((error) => (this.error = error));
    },
    showAlumni() {
      this.active = false;
      this.pledges = false;
      this.alumni = true;
      this.all = false;
      this.loaded = false;
      axios
        .get(process.env.VUE_APP_API + "read_alumni.php", {
          headers: { Authorization: this.$store.state.jwt },
        })
        .then((response) => {
          this.data = JSON.parse(response.data.substring(1));
          this.loaded = true;
          this.totalRows = this.data.body.length;
        })
        .catch((error) => (this.error = error));
    },
    showAll() {
      this.active = false;
      this.pledges = false;
      this.alumni = false;
      this.all = true;
      this.loaded = false;
      axios
        .get(process.env.VUE_APP_API + "read_students.php", {
          headers: { Authorization: this.$store.state.jwt },
        })
        .then((response) => {
          this.data = JSON.parse(response.data.substring(1));
          this.loaded = true;
          this.totalRows = this.data.body.length;
        })
        .catch((error) => (this.error = error));
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    viewStudent(id, isPledge) {
      if (isPledge == 0) {
        this.$router.push("/brother/" + id, () => {});
      } else {
        this.$router.push("/pledge/" + id, () => {});
      }
    },
    editStudent(id, isPledge) {
      if (isPledge == 0) {
        this.$router.push("/editbrother/" + id, () => {});
      } else {
        this.$router.push("/editpledge/" + id, () => {});
      }
    },
    deleteStudent(id, isPledge) {
      if (isPledge == 0) {
        console.log("Let's delete brother " + id);
      } else {
        console.log("Let's delete pledge " + id);
      }
    },
  },
};
</script>

<style>
.select-button {
  margin: 5px;
}
#wrapper {
  max-width: 1000px;
  padding: 20px;
  margin: 50px auto;
}
#buttons,
#error,
h1,
h3 {
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
</style>
