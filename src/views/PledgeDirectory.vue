<template>
  <div class="narrow-wrapper">
    <h1>Directory</h1>
    <div v-if="loaded" id="contents">
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
      </div>
      <b-table
        striped
        hover
        :items="data.body"
        :fields="fields"
        stacked="md"
        show-empty
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
    axios
      .get(this.$store.state.apiURL + "read_active_for_pledges.php", {
        headers: { Authorization: this.$store.state.jwt },
      })
      .then((response) => {
        this.data = response.data;
        this.loaded = true;
        this.totalRows = this.data.body.length;
      })
      .catch((error) => this.$root.$children[0].showError(error));
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
          key: "phone_number",
          sortable: false,
        },
      ],
      data: [],
      totalRows: 1,
      currentPage: 1,
      perPage: 5,
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
      axios
        .get(this.$store.state.apiURL + "read_active_for_pledges.php", {
          headers: { Authorization: this.$store.state.jwt },
        })
        .then((response) => {
          this.data = response.data;
          this.loaded = true;
          this.totalRows = this.data.body.length;
          this.fields = [
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
              key: "phone_number",
              sortable: false,
            },
          ];
        })
        .catch((error) => this.$root.$children[0].showError(error));
    },
    showPledges() {
      this.active = false;
      this.pledges = true;
      this.alumni = false;
      this.all = false;
      axios
        .get(this.$store.state.apiURL + "read_pledges.php", {
          headers: { Authorization: this.$store.state.jwt },
        })
        .then((response) => {
          this.data = response.data;
          this.loaded = true;
          this.totalRows = this.data.body.length;
          this.fields = [
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
              sortable: false,
            },
            { key: "actions", label: "Actions", sortable: false },
          ];
        })
        .catch((error) => this.$root.$children[0].showError(error));
    },
    viewStudent(id) {
      this.$router.push("/student/" + id, () => {});
    },
  },
};
</script>

<style scoped>
.select-button {
  margin: 5px;
}
#buttons,
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
