<template>
  <div class="wide-wrapper">
    <h1>Active Brothers by Standing</h1>
    <div v-if="loaded" id="contents">
      <b-table
        class="b-table"
        striped
        hover
        :items="data"
        :fields="fields"
        stacked="md"
        show-empty
        sort-icon-left
      >
        <template #cell(good_standing)="row">
          {{
            row.item.exceeds_owed == 1 || row.item.exceeds_unexcused == 1
              ? "No"
              : "Yes"
          }}
        </template>
        <template #cell(reason)="row">
          {{
            row.item.exceeds_owed == 1 && row.item.exceeds_unexcused == 1
              ? "Both"
              : row.item.exceeds_owed == 1
              ? "Unpaid Dues"
              : row.item.exceeds_unexcused == 1
              ? "Attendance"
              : ""
          }}
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
    axios
      .get(this.$store.state.apiURL + "read_active.php", {
        headers: { Authorization: this.$store.state.jwt },
      })
      .then((response) => {
        this.data = response.data.body;
        this.loaded = true;
        this.totalRows = response.data.itemCount;
      })
      .catch((error) =>
        this.$root.$children[0].showError(error.response.statusText)
      );
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
        { key: "name_last", sortable: true },
        { key: "name_first" },
        { key: "good_standing" },
        { key: "reason" },
      ],
      data: [],
      loaded: false,
    };
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
