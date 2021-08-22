<template>
  <div>
    <h2>Brother Account Balances</h2>
    <b-table
      v-if="loaded"
      class="b-table"
      striped
      hover
      :items="brothers"
      :fields="fields"
      stacked="md"
      show-empty
    >
      <template #cell(roll_number)="row">
        <b-link :to="'/account/' + row.item.id">
          {{ row.item.roll_number }}
        </b-link>
      </template>
      <template #cell(balance)="row">
        <div :class="row.item.balance_owed > 0 ? 'negative' : ''">
          {{
            row.item.balance_owed > 0
              ? "($" + Math.abs(row.item.balance_owed).toFixed(2) + ")"
              : "$" + Math.abs(row.item.balance_owed).toFixed(2)
          }}
        </div>
      </template>
    </b-table>
  </div>
</template>

<script>
export default {
  name: "StudentAccounts",
  props: {
    brothers: {
      type: Array,
      required: true,
    },
    loaded: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
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
        { key: "balance", sortable: true },
      ],
    };
  },
};
</script>

<style scoped>
h2 {
  margin-bottom: 20px;
}
.negative {
  color: red;
}
</style>
