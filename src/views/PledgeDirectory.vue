<template>
  <div id="wrapper">
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
            @click="viewStudent(row.item.id, row.item.is_pledge)"
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
    axios
      .get(process.env.VUE_APP_API + "read_active_for_pledges.php", {
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
      this.loaded = false;
      axios
        .get(process.env.VUE_APP_API + "read_active_for_pledges.php", {
          headers: { Authorization: this.$store.state.jwt },
        })
        .then((response) => {
          this.data = JSON.parse(response.data.substring(1));
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
        .catch((error) => (this.error = error));
    },
    viewStudent(id, isPledge) {
      if (isPledge == 1) {
        this.$router.push("/pledge/" + id, () => {});
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
  max-width: 800px;
  padding: 20px;
  margin: 50px auto;
}
#buttons,
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
