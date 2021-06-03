<template>
  <div class="narrow-wrapper">
    <h1>Directory</h1>
    <div v-if="loaded" id="contents">
      <b-form-group id="buttons" v-slot="{ ariaDescribedby }">
        <b-form-radio-group
          v-model="selected"
          :options="options"
          :aria-describedby="ariaDescribedby"
          buttons
        ></b-form-radio-group>
      </b-form-group>
      <b-table
        class="b-table"
        striped
        hover
        :items="data"
        :fields="fields"
        stacked="md"
        show-empty
        :current-page="currentPage"
        :per-page="perPage"
        sort-icon-left
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
      <div id="separator"></div>
      <b-col sm="7" md="6" class="my-1">
        <b-pagination
          id="pages"
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
          align="fill"
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
    this.showActive();
  },
  data() {
    return {
      AUTH_TIERS: AUTH_TIERS,
      selected: "active",
      options: [
        { text: "Active Brothers", value: "active" },
        { text: "Pledges", value: "pledges" },
      ],
      fields: null,
      data: [],
      totalRows: 1,
      currentPage: 1,
      perPage: 5,
      response: null,
      loaded: false,
    };
  },
  watch: {
    selected: function () {
      if (this.selected == "active") {
        this.showActive();
      } else {
        this.showPledges();
      }
    },
  },
  methods: {
    showActive() {
      axios
        .get(API_URL + "read_active_for_pledges.php", {
          headers: { Authorization: this.$store.state.jwt },
        })
        .then((response) => {
          this.data = response.data.body;
          this.loaded = true;
          this.totalRows = response.data.itemCount;
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
        .catch((error) =>
          this.$root.$children[0].showError(error.response.statusText)
        );
    },
    showPledges() {
      axios
        .get(API_URL + "read_pledges.php", {
          headers: { Authorization: this.$store.state.jwt },
        })
        .then((response) => {
          this.data = response.data.body;
          this.loaded = true;
          this.totalRows = response.data.itemCount;
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
        .catch((error) =>
          this.$root.$children[0].showError(error.response.statusText)
        );
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
