<template>
  <div class="medium-wrapper">
    <h1>Dues &amp; Fines</h1>
    <b-card no-body>
      <b-tabs card>
        <b-tab title="Student Accounts" active>
          <StudentAccounts />
        </b-tab>
        <b-tab title="Assess Dues">
          <AssessDues />
        </b-tab>
        <b-tab title="Report Payment">
          <ReportPayment />
        </b-tab>
        <b-tab title="Report Fine">
          <ReportFine />
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
import AssessDues from "@/components/AssessDues.vue";
import ReportFine from "@/components/ReportFine.vue";
import ReportPayment from "@/components/ReportPayment.vue";
import StudentAccounts from "@/components/StudentAccounts.vue";
export default {
  components: {
    AssessDues,
    ReportFine,
    ReportPayment,
    StudentAccounts,
  },
};
</script>

<style scoped>
h1 {
  margin-bottom: 20px;
}
.card {
  background-color: white !important;
  box-shadow: none;
}
.tab-pane {
  padding: 50px;
}
</style>
